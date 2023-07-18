import { TibboSettingValidation, TibboValueMapping } from '../tibbo-shared';
export declare class TibboSetting {
    id: string;
    type: string;
    control: string;
    readonly value: any;
    readonly rawValue: number | string;
    private readonly greaterThan?;
    private readonly lessThan?;
    private readonly invalidMessage?;
    private readonly valueMapping?;
    constructor(value: number | string, raw: {
        id: string;
        type: string;
        control: string;
        validation?: TibboSettingValidation;
        valueMapping?: TibboValueMapping;
    });
    validateValue(value: string | number): string | null | undefined;
    mapValue(value: number | string): any;
}
