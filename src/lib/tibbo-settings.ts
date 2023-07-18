import {
  TibboSetting,
  TibboSettingGroup,
  TibboSettingValidation,
  TibboValueMapping,
} from './types';
import { TibboRequests } from './tibbo-requests';

export class TibboSettings {
  private groups: TibboSettingGroup[] = [];

  /**
   * Get all settings from the Tibbo device
   *
   * @param deviceAddress IP address of the Tibbo
   */
  public async getAll(deviceAddress: string) {
    const settingsDef = await TibboRequests.getPlainRequest(deviceAddress, {
      e: 's',
      a: 'def',
      p: '',
    });

    return this.parse(settingsDef, deviceAddress);
  }

  /**
   * Get a setting value from the Tibbo device
   *
   * @param deviceAddress IP address of the Tibbo
   * @param settingID Name/ID of the setting
   */
  public async get(deviceAddress: string, settingID: string) {
    const settings = await this.getAll(deviceAddress);

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
   */
  public async set(
    deviceAddress: string,
    settingID: string,
    settingValue: string | number,
  ) {
    const settings = await this.getAll(deviceAddress);

    const setting = settings
      .find((group) => {
        return group.settings.find((setting) => setting.id === settingID);
      })
      ?.settings.find((setting) => setting.id === settingID);

    if (!setting)
      throw new Error(`Could not find setting with ID '${settingID}'`);

    const validationError = setting.validateValue(settingValue);

    if (!!validationError) throw new Error(validationError);

    return this.setSettingValue(
      deviceAddress,
      settingID,
      setting.mapValue(settingValue),
    );
  }

  /**
   * Initialize the Tibbo device's settings, i.e. reset them to their defaults
   *
   * @param deviceAddress IP address of the Tibbo device
   */
  public async initialize(deviceAddress: string) {
    return this.initializeSettings(deviceAddress);
  }

  /**
   * Parse the raw settings definition
   * @param settingsDef
   * @param deviceAddress
   * @private @internal
   */
  private async parse(settingsDef: string, deviceAddress: string) {
    let currentGroup: TibboSettingGroup | undefined = undefined;

    const splitSettingsDef = settingsDef.split(';\r\n');
    for (const line1 of splitSettingsDef.filter(
      (line) => !line.includes('settings.xtxt'),
    )) {
      const splitLine = line1.split(';');

      if (splitLine.includes('T=GROUP')) {
        currentGroup = this.parseGroup(line1);

        this.groups.push(currentGroup);
      } else if (currentGroup !== undefined) {
        currentGroup.settings.push(
          await this.parseSetting(line1, deviceAddress),
        );
      }
    }

    return this.groups;
  }

  /**
   * Parse a validation line like `V=SETTING_ONE<=1&&SETTING_ONE>=0?"":"Value must be between 0 and 1"`
   * @param validationLine A string containing validation settings
   * @private @internal
   */
  private parseValidation(validationLine: string): TibboSettingValidation {
    const splitValidation = validationLine.split('&&');

    const lessThan = Number(splitValidation[0].split('<=')[1]) + 1;
    const greaterThan =
      Number(splitValidation[1].split('>=')[1].split('?')[0]) - 1;

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
  private parseValueMapping(mappingLine: string) {
    const valueObject: TibboValueMapping = {};

    const cleanLine = mappingLine.replace('O=', '').match(/.{1,3}/g);

    if (cleanLine === null) return undefined;

    const splitValueMapping = (array: string[], n: number) => {
      const [...arr] = array;
      const res = [];
      while (arr.length) {
        res.push(arr.splice(0, n).map((s) => s.replaceAll('/', '')));
      }
      return res;
    };

    splitValueMapping(cleanLine, 2).forEach((mapping) => {
      const key = mapping[1];

      if (!isNaN(Number(key))) {
        valueObject[Number(key)] = mapping[0];
      } else valueObject[key] = mapping[0];
    });

    return valueObject;
  }

  /**
   * Parse a raw settings string like `I=SETTING_ONE;T=STRING;C=STATIC;D=Demo Setting 1;V=SETTING_ONE<=1&&SETTING_ONE>=0?"":"Value must be between 0 and 1";O=Off/0/On/1`
   * @param settingDef
   * @param deviceAddress
   * @private
   */
  private async parseSetting(settingDef: string, deviceAddress: string) {
    const settingObject: {
      id: string;
      type: string;
      control: string;
      validation?: TibboSettingValidation;
      valueMapping?: TibboValueMapping;
    } = {
      id: '',
      type: '',
      control: '',
    };

    const splitSetting = settingDef.split(';');

    if (splitSetting.length === 6)
      settingObject.valueMapping = this.parseValueMapping(
        splitSetting.pop() as string,
      );

    if (splitSetting.length === 5)
      settingObject.validation = this.parseValidation(
        splitSetting.pop() as string,
      );

    splitSetting.slice(0, splitSetting.length - 1).forEach((s) => {
      const [rawKey, value] = s.split('=');
      (settingObject as any)[this.getSettingKey(rawKey)] = value;
    });

    const value = await this.getSettingValue(deviceAddress, settingObject.id);
    return new TibboSetting(value, settingObject);
  }

  /**
   * Parse a group line like `I=group1;D=General;T=GROUP`
   * @param groupDef
   * @private
   */
  private parseGroup(groupDef: string) {
    const groupObject: TibboValueMapping = {};

    groupDef
      .replace('\r\n', '')
      .replace('"', '')
      .split(';')
      .forEach((s) => {
        const [rawKey, value] = s.split('=');
        groupObject[this.getGroupKey(rawKey)] = value;
      });

    return new TibboSettingGroup(groupObject);
  }

  /**
   * Maps group identifiers like `I` or `D` into something useful
   * @param raw
   * @private @internal
   */
  private getGroupKey(raw: string): string {
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
  private getSettingKey(raw: string): string {
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
   * @private @internal
   */
  private async getSettingValue(deviceAddress: string, settingID: string) {
    const valueResponse = await TibboRequests.postPlainRequest(deviceAddress, {
      e: 's',
      a: 'cmd',
      p: '',
      cmd: `G${settingID}`,
    });

    const clean = valueResponse.slice(2, valueResponse.length - 1);

    if (isNaN(Number(clean))) return clean;

    return Number(clean);
  }

  /**
   * Performs the POST request for setting the setting value
   *
   * @param deviceAddress IP address of the Tibbo device
   * @param settingID Name/ID of the setting
   * @param settingValue New setting value
   * @private @internal
   */
  private async setSettingValue(
    deviceAddress: string,
    settingID: string,
    settingValue: string | number,
  ) {
    const valueResponse = await TibboRequests.postPlainRequest(deviceAddress, {
      e: 's',
      a: 'cmd',
      p: '',
      cmd: `S${settingID}@${settingValue}`,
    });

    return valueResponse.slice(1, 2) === 'A';
  }

  /**
   * Performs the POST request to initialize the Tibbo device's settings
   * @param deviceAddress IP address of the Tibbo device
   * @private @internal
   */
  private async initializeSettings(deviceAddress: string) {
    const initializeResponse = await TibboRequests.postPlainRequest(
      deviceAddress,
      {
        e: 's',
        a: 'cmd',
        p: '',
        cmd: `I`,
      },
    );

    return initializeResponse.slice(1, 2) === 'A';
  }
}