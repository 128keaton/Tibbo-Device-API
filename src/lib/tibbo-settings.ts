import {
  TibboSetting,
  TibboSettingGroup,
  TibboSettingValidation,
  TibboValueMapping,
} from './types';
import { TibboRequests } from './tibbo-requests';

export class TibboSettings {
  /**
   * Get all settings from the Tibbo device
   *
   * @param deviceAddress IP address of the Tibbo
   * @param auth
   */
  public async getAll(
    deviceAddress: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const settingsDef = await TibboRequests.getPlainRequest(
      deviceAddress,
      {
        e: 's',
        a: 'def',
        p: '',
      },
      auth,
    );

    return this.parse(settingsDef, deviceAddress, auth);
  }

  /**
   * Get a setting value from the Tibbo device
   *
   * @param deviceAddress IP address of the Tibbo
   * @param settingID Name/ID of the setting
   * @param auth
   */
  public async get(
    deviceAddress: string,
    settingID: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const settings = await this.getAll(deviceAddress, auth);

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
   * @param auth
   */
  public async set(
    deviceAddress: string,
    settingID: string,
    settingValue: string | number,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const settings = await this.getAll(deviceAddress, auth);

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
      auth,
    );
  }

  /**
   * Set multiple settings
   *
   * @param deviceAddress IP address of the Tibbo device
   * @param settings key/value object with setting IDs and setting values
   * @param auth
   */
  public async setMultiple(
    deviceAddress: string,
    settings: { [key: string]: string | number },
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const currentSettings = (await this.getAll(deviceAddress, auth)).flatMap(
      (settingGroup) => settingGroup.settings,
    );

    const promises = Object.keys(settings).map((settingID) => {
      const setting = currentSettings.find(
        (setting) => setting.id === settingID,
      );
      const settingValue = settings[settingID];

      if (!setting)
        throw new Error(`Could not find setting with ID '${settingID}'`);

      const validationError = setting.validateValue(settingValue);
      if (!!validationError) throw new Error(validationError);

      return this.setSettingValue(
        deviceAddress,
        settingID,
        setting.mapValue(settingValue),
        auth,
      );
    });

    return Promise.all(promises);
  }

  /**
   * Export the device's current settings to String
   *
   * @param deviceAddress IP address of the Tibbo device
   * @param auth
   */
  public async export(
    deviceAddress: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const currentSettings = (await this.getAll(deviceAddress, auth)).flatMap(
      (settingGroup) => settingGroup.settings,
    );

    const settingsExported: { [key: string]: string | number } = {};

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
   * @param auth
   */
  public async import(
    deviceAddress: string,
    raw: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const settings = JSON.parse(raw) as { [key: string]: string | number };

    return this.setMultiple(deviceAddress, settings, auth);
  }

  /**
   * Initialize the Tibbo device's settings, i.e. reset them to their defaults
   *
   * @param deviceAddress IP address of the Tibbo device
   * @param auth
   */
  public async initialize(
    deviceAddress: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    return this.initializeSettings(deviceAddress, auth);
  }

  /**
   * Parse the raw settings definition
   * @param settingsDef
   * @param deviceAddress
   * @param auth
   * @private @internal
   */
  private async parse(
    settingsDef: string,
    deviceAddress: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    let currentGroup: TibboSettingGroup | undefined = undefined;

    const groups: TibboSettingGroup[] = [];

    const splitSettingsDef = settingsDef.split(';\r\n');
    for (const line1 of splitSettingsDef.filter(
      (line) => !line.includes('settings.xtxt'),
    )) {
      const splitLine = line1.split(';');

      if (splitLine.includes('T=GROUP')) {
        currentGroup = this.parseGroup(line1);

        groups.push(currentGroup);
      } else if (currentGroup !== undefined) {
        currentGroup.settings.push(
          await this.parseSetting(line1, deviceAddress, auth),
        );
      }
    }

    return groups;
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

    let value: string | undefined = undefined;
    mappingLine
      .replace('O=', '')
      .split('/')
      .forEach((keyOrValue) => {
        if (!!value) {
          const key = keyOrValue;
          if (!isNaN(Number(key))) {
            valueObject[Number(key)] = value;
          } else valueObject[key] = value;

          value = undefined;
        } else {
          value = keyOrValue;
        }
      });

    return valueObject;
  }

  /**
   * Parse a raw settings string like `I=SETTING_ONE;T=STRING;C=STATIC;D=Demo Setting 1;V=SETTING_ONE<=1&&SETTING_ONE>=0?"":"Value must be between 0 and 1";O=Off/0/On/1`
   * @param settingDef
   * @param deviceAddress
   * @param auth
   * @private
   */
  private async parseSetting(
    settingDef: string,
    deviceAddress: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const settingObject: {
      id: string;
      type: string;
      control: string;
      description?: string;
      validation?: TibboSettingValidation;
      valueMapping?: TibboValueMapping;
    } = {
      id: '',
      type: '',
      control: '',
    };

    const splitSetting = settingDef.split(';');

    if (
      splitSetting.length === 6 ||
      (splitSetting.length === 5 && splitSetting[4][0] === 'O')
    )
      settingObject.valueMapping = this.parseValueMapping(
        splitSetting.pop() as string,
      );

    if (splitSetting.length === 5)
      settingObject.validation = this.parseValidation(
        splitSetting.pop() as string,
      );

    splitSetting.forEach((s) => {
      const [rawKey, value] = s.split('=');
      (settingObject as any)[this.getSettingKey(rawKey)] = value;
    });

    const value = await this.getSettingValue(
      deviceAddress,
      settingObject.id,
      auth,
    );
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
   * @param auth
   * @private @internal
   */
  private async getSettingValue(
    deviceAddress: string,
    settingID: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const valueResponse = await TibboRequests.postPlainRequest(
      deviceAddress,
      {
        e: 's',
        a: 'cmd',
        p: '',
        cmd: `G${settingID}`,
      },
      undefined,
      undefined,
      auth,
    ).then((result) => result.text());

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
   * @param auth
   * @private @internal
   */
  private async setSettingValue(
    deviceAddress: string,
    settingID: string,
    settingValue: string | number,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const valueResponse = await TibboRequests.postPlainRequest(
      deviceAddress,
      {
        e: 's',
        a: 'cmd',
        p: '',
        cmd: `S${settingID}@${settingValue}`,
      },
      undefined,
      undefined,
      auth,
    ).then((result) => result.text());

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
   * @param auth
   * @private @internal
   */
  private async initializeSettings(
    deviceAddress: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const initializeResponse = await TibboRequests.postPlainRequest(
      deviceAddress,
      {
        e: 's',
        a: 'cmd',
        p: '',
        cmd: `I`,
      },
      undefined,
      undefined,
      auth,
    ).then((result) => result.text());

    const didSucceed = initializeResponse.slice(1, 2) === 'A';
    return {
      deviceAddress,
      didSucceed,
    };
  }
}
