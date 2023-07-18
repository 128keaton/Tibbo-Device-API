import { TibboSetting, TibboSettingGroup } from './types';
export declare class TibboSettings {
    private groups;
    /**
     * Get all settings from the Tibbo device
     *
     * @param deviceAddress IP address of the Tibbo
     */
    getAll(deviceAddress: string): Promise<TibboSettingGroup[]>;
    /**
     * Get a setting value from the Tibbo device
     *
     * @param deviceAddress IP address of the Tibbo
     * @param settingID Name/ID of the setting
     */
    get(deviceAddress: string, settingID: string): Promise<TibboSetting>;
    /**
     * Set a setting value by the ID on the Tibbo device. This is validated against the rules set
     *
     * @param deviceAddress IP address of the Tibbo
     * @param settingID Name/ID of the setting
     * @param settingValue New value for the setting
     */
    set(deviceAddress: string, settingID: string, settingValue: string | number): Promise<boolean>;
    /**
     * Initialize the Tibbo device's settings, i.e. reset them to their defaults
     *
     * @param deviceAddress IP address of the Tibbo device
     */
    initialize(deviceAddress: string): Promise<boolean>;
    /**
     * Parse the raw settings definition
     * @param settingsDef
     * @param deviceAddress
     * @private @internal
     */
    private parse;
    /**
     * Parse a validation line like `V=SETTING_ONE<=1&&SETTING_ONE>=0?"":"Value must be between 0 and 1"`
     * @param validationLine A string containing validation settings
     * @private @internal
     */
    private parseValidation;
    /**
     * Parse a value mapping line like `O=Off/0/On/1`
     * @param mappingLine
     * @private @internal
     */
    private parseValueMapping;
    /**
     * Parse a raw settings string like `I=SETTING_ONE;T=STRING;C=STATIC;D=Demo Setting 1;V=SETTING_ONE<=1&&SETTING_ONE>=0?"":"Value must be between 0 and 1";O=Off/0/On/1`
     * @param settingDef
     * @param deviceAddress
     * @private
     */
    private parseSetting;
    /**
     * Parse a group line like `I=group1;D=General;T=GROUP`
     * @param groupDef
     * @private
     */
    private parseGroup;
    /**
     * Maps group identifiers like `I` or `D` into something useful
     * @param raw
     * @private @internal
     */
    private getGroupKey;
    /**
     * Maps setting identifiers like `I` or `D` into something useful
     * @param raw
     * @private
     */
    private getSettingKey;
    /**
     * Performs the GET request for getting the setting value
     *
     * @param deviceAddress IP address of the Tibbo device
     * @param settingID Name/ID of the setting
     * @private @internal
     */
    private getSettingValue;
    /**
     * Performs the POST request for setting the setting value
     *
     * @param deviceAddress IP address of the Tibbo device
     * @param settingID Name/ID of the setting
     * @param settingValue New setting value
     * @private @internal
     */
    private setSettingValue;
    /**
     * Performs the POST request to initialize the Tibbo device's settings
     * @param deviceAddress IP address of the Tibbo device
     * @private @internal
     */
    private initializeSettings;
}
