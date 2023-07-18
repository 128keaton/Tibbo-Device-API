import { TibboSetting } from './tibbo-setting';
import { TibboValueMapping } from '../tibbo-shared';
export declare class TibboSettingGroup {
    readonly id: string;
    readonly displayName: string;
    settings: TibboSetting[];
    constructor(raw: TibboValueMapping);
}
