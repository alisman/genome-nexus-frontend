import * as React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import BiologicalFunctionStyles from './BiologicalFunction.module.scss';
import { DefaultTooltip } from 'cbioportal-frontend-commons';
import functionalGroupsStyle from '../functionalGroups.module.scss';
import { IndicatorQueryResp } from 'cbioportal-frontend-commons/api/generated/OncoKbAPI';

interface IOncokbProps {
    oncokb: IndicatorQueryResp | undefined;
}

export enum ONCOGENICITY {
    ONCOGENIC = 'Oncogenic',
    LIKELY_ONCOGENIC = 'Likely Oncogenic',
    PREDICTED_ONCOGENIC = 'Predicted Oncogenic',
    NEUTRAL = 'Neutral',
    LIKELY_NEUTRAL = 'Likely Neutral',
    INCONCLUSIVE = 'Inconclusive',
    VUS = 'vus',
    UNKNOWN = 'Unknown',
}

export const ONCOGENICITY_CLASS_NAMES: { [oncogenic: string]: string } = {
    [ONCOGENICITY.ONCOGENIC]: 'oncogenic',
    [ONCOGENICITY.LIKELY_ONCOGENIC]: 'oncogenic',
    [ONCOGENICITY.PREDICTED_ONCOGENIC]: 'oncogenic',
    [ONCOGENICITY.NEUTRAL]: 'neutral',
    [ONCOGENICITY.LIKELY_NEUTRAL]: 'neutral',
    [ONCOGENICITY.INCONCLUSIVE]: 'inconclusive',
    [ONCOGENICITY.VUS]: 'vus',
    [ONCOGENICITY.UNKNOWN]: 'unknown',
};

export enum MUTATION_EFFECT {
    GAIN_OF_FUNCTION = 'Gain-of-function',
    LIKELY_GAIN_OF_FUNCTION = 'Likely Gain-of-function',
    LOSS_OF_FUNCTION = 'Loss-of-function',
    LIKELY_LOSS_OF_FUNCTION = 'Likely Loss-of-function',
    SWITCH_OF_FUNCTION = 'Switch-of-function',
    LIKELY_SWITCH_OF_FUNCTION = 'Likely Switch-of-function',
    NEUTRAL = 'Neutral',
    LIKELY_NEUTRAL = 'Likely Neutral',
    INCONCLUSIVE = 'Inconclusive',
    UNKNOWN = 'Unknown',
}

export const MUTATION_EFFECT_CLASS_NAMES: {
    [mutationEffect: string]: string;
} = {
    [MUTATION_EFFECT.GAIN_OF_FUNCTION]: 'gain',
    [MUTATION_EFFECT.LIKELY_GAIN_OF_FUNCTION]: 'gain',
    [MUTATION_EFFECT.LOSS_OF_FUNCTION]: 'loss',
    [MUTATION_EFFECT.LIKELY_LOSS_OF_FUNCTION]: 'loss',
    [MUTATION_EFFECT.SWITCH_OF_FUNCTION]: 'switch',
    [MUTATION_EFFECT.LIKELY_SWITCH_OF_FUNCTION]: 'switch',
    [MUTATION_EFFECT.NEUTRAL]: 'neutral',
    [MUTATION_EFFECT.LIKELY_NEUTRAL]: 'neutral',
    [MUTATION_EFFECT.INCONCLUSIVE]: 'inconclusive',
    [MUTATION_EFFECT.UNKNOWN]: 'unknown',
};

export const ONCOKB_URL = 'https://oncokb.org';

@observer
export default class Oncokb extends React.Component<IOncokbProps> {
    public oncogenicity(oncokb: IndicatorQueryResp) {
        if (oncokb.oncogenic && oncokb.oncogenic !== '') {
            return (
                <span
                    className={classNames(
                        BiologicalFunctionStyles[
                            `oncogenicity-${
                                ONCOGENICITY_CLASS_NAMES[oncokb.oncogenic]
                            }`
                        ],
                        BiologicalFunctionStyles['oncogenicity-text']
                    )}
                >
                    {oncokb.oncogenic}
                </span>
            );
        } else {
            return (
                <span className={functionalGroupsStyle['data-content']}></span>
            );
        }
    }
    public oncokbTooltip(oncokbUrl: string) {
        return (
            <DefaultTooltip
                placement="top"
                overlay={
                    <span>
                        <a
                            href={oncokbUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            OncoKB
                        </a>{' '}
                        is a precision oncology knowledge base and contains
                        <br />
                        information about the effects and treatment implications
                        <br />
                        of specific cancer gene alterations. <br />
                    </span>
                }
            >
                <span className={functionalGroupsStyle['data-source']}>
                    OncoKB
                </span>
            </DefaultTooltip>
        );
    }

    public mutationEffect(oncokb: IndicatorQueryResp) {
        if (oncokb.mutationEffect && oncokb.mutationEffect.knownEffect !== '') {
            return (
                <span
                    className={classNames(
                        BiologicalFunctionStyles[
                            `mutation-effect-${
                                MUTATION_EFFECT_CLASS_NAMES[
                                    oncokb.mutationEffect.knownEffect
                                ]
                            }`
                        ],
                        BiologicalFunctionStyles['mutation-effect-text']
                    )}
                >
                    {oncokb.mutationEffect.knownEffect}
                </span>
            );
        } else {
            return (
                <span
                    className={classNames(
                        functionalGroupsStyle['data-content'],
                        functionalGroupsStyle['oncokb']
                    )}
                >
                    N/A
                </span>
            );
        }
    }
    public render() {
        var oncokbUrl = generateOncokbLink(ONCOKB_URL, this.props.oncokb);
        if (this.props.oncokb) {
            return (
                <span
                    className={classNames(
                        functionalGroupsStyle['data-group-gap'],
                        functionalGroupsStyle['link']
                    )}
                >
                    <a
                        href={oncokbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {this.oncokbTooltip(oncokbUrl)}
                        {this.mutationEffect(this.props.oncokb)}
                        {this.oncogenicity(this.props.oncokb)}
                    </a>
                </span>
            );
        } else {
            return (
                <span className={functionalGroupsStyle['link']}>
                    <a
                        href={oncokbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {this.oncokbTooltip(oncokbUrl)}
                        <span
                            className={classNames(
                                functionalGroupsStyle['data-content'],
                                functionalGroupsStyle['oncokb']
                            )}
                        >
                            N/A
                        </span>
                    </a>
                </span>
            );
        }
    }
}

export function generateOncokbLink(
    link: string,
    oncokb: IndicatorQueryResp | undefined
): string {
    let url = link;
    const hugoSymbol = oncokb && oncokb.query && oncokb.query.hugoSymbol;
    const alteration = oncokb && oncokb.query && oncokb.query.alteration;
    if (hugoSymbol && alteration) {
        url = `${url}/gene/${hugoSymbol}/${alteration}`;
    }
    return url;
}
