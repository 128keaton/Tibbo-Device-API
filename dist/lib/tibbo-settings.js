"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboSettings = void 0;
const types_1 = require("./types");
const tibbo_requests_1 = require("./tibbo-requests");
class TibboSettings {
    tibboRequests = tibbo_requests_1.TibboRequests.getInstance();
    /**
     * Get all settings from the Tibbo device
     *
     * @param deviceAddress IP address of the Tibbo
     * @param devicePassword
     */
    async getAll(deviceAddress, devicePassword) {
        const settingsDef = await this.tibboRequests.getPlainRequest(deviceAddress, {
            e: 's',
            a: 'def',
        }, devicePassword);
        return this.parse(settingsDef, deviceAddress, devicePassword);
    }
    /**
     * Get a setting value from the Tibbo device
     *
     * @param deviceAddress IP address of the Tibbo
     * @param settingID Name/ID of the setting
     * @param devicePassword
     */
    async get(deviceAddress, settingID, devicePassword) {
        const settings = await this.getAll(deviceAddress, devicePassword);
        const setting = settings
            .find((group) => {
            return group.settings.find((setting) => setting.id === settingID);
        })
            ?.settings.find((setting) => setting.id === settingID);
        if (!setting)
            throw new Error(`Could not find setting with ID '${settingID}'`);
        return setting;
    }
    /**
     * Set a setting value by the ID on the Tibbo device. This is validated against the rules set
     *
     * @param deviceAddress IP address of the Tibbo
     * @param settingID Name/ID of the setting
     * @param settingValue New value for the setting
     * @param devicePassword
     */
    async set(deviceAddress, settingID, settingValue, devicePassword) {
        const settings = await this.getAll(deviceAddress, devicePassword);
        const setting = settings
            .find((group) => {
            return group.settings.find((setting) => setting.id === settingID);
        })
            ?.settings.find((setting) => setting.id === settingID);
        if (!setting)
            throw new Error(`Could not find setting with ID '${settingID}'`);
        const validationError = setting.validateValue(settingValue);
        if (!!validationError)
            throw new Error(validationError);
        return this.setSettingValue(deviceAddress, settingID, setting.mapValue(settingValue), devicePassword);
    }
    /**
     * Set multiple settings
     *
     * @param deviceAddress IP address of the Tibbo device
     * @param settings key/value object with setting IDs and setting values
     * @param devicePassword
     */
    async setMultiple(deviceAddress, settings, devicePassword) {
        const currentSettings = (await this.getAll(deviceAddress, devicePassword)).flatMap((settingGroup) => settingGroup.settings);
        const promises = Object.keys(settings).map((settingID) => {
            const setting = currentSettings.find((setting) => setting.id === settingID);
            const settingValue = settings[settingID];
            if (!setting)
                throw new Error(`Could not find setting with ID '${settingID}'`);
            const validationError = setting.validateValue(settingValue);
            if (!!validationError)
                throw new Error(validationError);
            return this.setSettingValue(deviceAddress, settingID, setting.mapValue(settingValue), devicePassword);
        });
        return Promise.all(promises);
    }
    /**
     * Export the device's current settings to String
     *
     * @param deviceAddress IP address of the Tibbo device
     * @param devicePassword
     */
    async export(deviceAddress, devicePassword) {
        const currentSettings = (await this.getAll(deviceAddress, devicePassword)).flatMap((settingGroup) => settingGroup.settings);
        const settingsExported = {};
        currentSettings.forEach((setting) => {
            settingsExported[setting.id] = setting.rawValue;
        });
        return settingsExported;
    }
    /**
     * Import JSON settings to device
     *
     * @param deviceAddress IP address of the Tibbo device
     * @param raw raw key/value JSON string of setting IDs and values
     * @param devicePassword
     */
    async import(deviceAddress, raw, devicePassword) {
        const settings = JSON.parse(raw);
        return this.setMultiple(deviceAddress, settings, devicePassword);
    }
    /**
     * Initialize the Tibbo device's settings, i.e. reset them to their defaults
     *
     * @param deviceAddress IP address of the Tibbo device
     * @param devicePassword
     */
    async initialize(deviceAddress, devicePassword) {
        return this.initializeSettings(deviceAddress, devicePassword);
    }
    /**
     * Parse the raw settings definition
     * @param settingsDef
     * @param deviceAddress
     * @param devicePassword
     * @private @internal
     */
    async parse(settingsDef, deviceAddress, devicePassword) {
        let currentGroup = undefined;
        const groups = [];
        const splitSettingsDef = settingsDef.split(';\r\n');
        for (const line1 of splitSettingsDef.filter((line) => !line.includes('settings.xtxt'))) {
            const splitLine = line1.split(';');
            if (splitLine.includes('T=GROUP')) {
                currentGroup = this.parseGroup(line1);
                groups.push(currentGroup);
            }
            else if (currentGroup !== undefined) {
                currentGroup.settings.push(await this.parseSetting(line1, deviceAddress, devicePassword));
            }
        }
        return groups;
    }
    /**
     * Parse a validation line like `V=SETTING_ONE<=1&&SETTING_ONE>=0?"":"Value must be between 0 and 1"`
     * @param validationLine A string containing validation settings
     * @private @internal
     */
    parseValidation(validationLine) {
        const splitValidation = validationLine.split('&&');
        const lessThan = Number(splitValidation[0].split('<=')[1]) + 1;
        const greaterThan = Number(splitValidation[1].split('>=')[1].split('?')[0]) - 1;
        const message = validationLine.split(':')[1].replaceAll('"', '');
        return {
            message,
            lessThan,
            greaterThan,
        };
    }
    /**
     * Parse a value mapping line like `O=Off/0/On/1`
     * @param mappingLine
     * @private @internal
     */
    parseValueMapping(mappingLine) {
        const valueObject = {};
        let value = undefined;
        mappingLine
            .replace('O=', '')
            .split('/')
            .forEach((keyOrValue) => {
            if (!!value) {
                const key = keyOrValue;
                if (!isNaN(Number(key))) {
                    valueObject[Number(key)] = value;
                }
                else
                    valueObject[key] = value;
                value = undefined;
            }
            else {
                value = keyOrValue;
            }
        });
        return valueObject;
    }
    /**
     * Parse a raw settings string like `I=SETTING_ONE;T=STRING;C=STATIC;D=Demo Setting 1;V=SETTING_ONE<=1&&SETTING_ONE>=0?"":"Value must be between 0 and 1";O=Off/0/On/1`
     * @param settingDef
     * @param deviceAddress
     * @param devicePassword
     * @private
     */
    async parseSetting(settingDef, deviceAddress, devicePassword) {
        const settingObject = {
            id: '',
            type: '',
            control: '',
        };
        const splitSetting = settingDef.split(';');
        if (splitSetting.length === 6 ||
            (splitSetting.length === 5 && splitSetting[4][0] === 'O'))
            settingObject.valueMapping = this.parseValueMapping(splitSetting.pop());
        if (splitSetting.length === 5)
            settingObject.validation = this.parseValidation(splitSetting.pop());
        splitSetting.forEach((s) => {
            const [rawKey, value] = s.split('=');
            settingObject[this.getSettingKey(rawKey)] = value;
        });
        const value = await this.getSettingValue(deviceAddress, settingObject.id, devicePassword);
        return new types_1.TibboSetting(value, settingObject);
    }
    /**
     * Parse a group line like `I=group1;D=General;T=GROUP`
     * @param groupDef
     * @private
     */
    parseGroup(groupDef) {
        const groupObject = {};
        groupDef
            .replace('\r\n', '')
            .replace('"', '')
            .split(';')
            .forEach((s) => {
            const [rawKey, value] = s.split('=');
            groupObject[this.getGroupKey(rawKey)] = value;
        });
        return new types_1.TibboSettingGroup(groupObject);
    }
    /**
     * Maps group identifiers like `I` or `D` into something useful
     * @param raw
     * @private @internal
     */
    getGroupKey(raw) {
        switch (raw) {
            case 'I':
                return 'id';
            case 'D':
                return 'displayName';
            case 'T':
                return 'type';
            default:
                return raw;
        }
    }
    /**
     * Maps setting identifiers like `I` or `D` into something useful
     * @param raw
     * @private
     */
    getSettingKey(raw) {
        switch (raw) {
            case 'I':
                return 'id';
            case 'D':
                return 'description';
            case 'T':
                return 'type';
            case 'C':
                return 'control';
            default:
                return raw;
        }
    }
    /**
     * Performs the GET request for getting the setting value
     *
     * @param deviceAddress IP address of the Tibbo device
     * @param settingID Name/ID of the setting
     * @param devicePassword
     * @private @internal
     */
    async getSettingValue(deviceAddress, settingID, devicePassword) {
        const valueResponse = await this.tibboRequests
            .postPlainRequest(deviceAddress, {
            e: 's',
            a: 'cmd',
            cmd: `G${settingID}`,
        }, undefined, undefined, devicePassword)
            .then((result) => result.text());
        const clean = valueResponse.slice(2, valueResponse.length - 1);
        if (isNaN(Number(clean)))
            return clean;
        return Number(clean);
    }
    /**
     * Performs the POST request for setting the setting value
     *
     * @param deviceAddress IP address of the Tibbo device
     * @param settingID Name/ID of the setting
     * @param settingValue New setting value
     * @param devicePassword
     * @private @internal
     */
    async setSettingValue(deviceAddress, settingID, settingValue, devicePassword) {
        const valueResponse = await this.tibboRequests
            .postPlainRequest(deviceAddress, {
            e: 's',
            a: 'cmd',
            cmd: `S${settingID}@${settingValue}`,
        }, undefined, undefined, devicePassword)
            .then((result) => result.text());
        const didSucceed = valueResponse.slice(1, 2) === 'A';
        return {
            settingID,
            deviceAddress,
            didSucceed,
        };
    }
    /**
     * Performs the POST request to initialize the Tibbo device's settings
     * @param deviceAddress IP address of the Tibbo device
     * @param devicePassword
     * @private @internal
     */
    async initializeSettings(deviceAddress, devicePassword) {
        const initializeResponse = await this.tibboRequests
            .postPlainRequest(deviceAddress, {
            e: 's',
            a: 'cmd',
            cmd: `I`,
        }, undefined, undefined, devicePassword)
            .then((result) => result.text());
        const didSucceed = initializeResponse.slice(1, 2) === 'A';
        return {
            deviceAddress,
            didSucceed,
        };
    }
}
exports.TibboSettings = TibboSettings;
