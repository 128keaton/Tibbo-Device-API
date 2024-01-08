import { TibboSettings } from '../../lib';
import fetch from 'node-fetch';

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');

const mockFetch = () => {
  return (fetch as jest.MockedFunction<typeof fetch>).mockImplementation(
    (url, init) => {
      if (url === 'http://0.0.0.0/api.html?e=s&a=def')
        return Promise.resolve(
          new Response(
            `"I=group1;D=General;T=GROUP;\r\nI=SETTING_ONE;T=STRING;C=STATIC;D=Demo Setting 1;V=SETTING_ONE<=1&&SETTING_ONE>=0?"":"Value must be between 0 and 1";O=Off/0/On/1;\r\nI=SETTING_NAME1;T=STRING;C=IPCTRL;D=SettingDescriptionThing;V=SETTING_NAME1<=100&&SETTING_NAME1>=1?"":"Value must be between 1 and 100";\r\nI=stg2;T=DATETIME;C=PASSWORD;D=Setting Display Name;\r\n    @@STG_RefPath=settings.xtxt"`,
          ),
        );

      if (!!init) {
        if (init.body === 'e=s&a=cmd&cmd=GSETTING_NAME1') {
          return Promise.resolve(new Response('BA1\n'));
        } else if (`${init.body || ''}`.includes('e=s&a=cmd&cmd=S')) {
          return Promise.resolve(new Response('BA1\r'));
        } else if (init.body === 'e=s&a=cmd&cmd=I') {
          return Promise.resolve(new Response('BA\r'));
        } else if (init.body === 'e=s&a=cmd&cmd=GSETTING_ONE') {
          return Promise.resolve(new Response('A1\n'));
        }
      }

      return Promise.resolve(new Response());
    },
  );
};

describe('TibboSettings', () => {
  test('get settings', async () => {
    const tibboSettings = new TibboSettings();

    mockFetch();

    const response = await tibboSettings.getAll('http://0.0.0.0');

    expect(response.length).toEqual(1);
    expect(response[0].id).toEqual('group1');
    expect(response[0].displayName).toEqual('General');
    expect(response[0].settings[0].id).toEqual('SETTING_ONE');
    expect(response[0].settings[0].description).toEqual('Demo Setting 1');
    expect(response[0].settings[1].value).toEqual(1);
  });

  test('set setting', async () => {
    const tibboSettings = new TibboSettings();

    const deviceAddress = 'http://0.0.0.0';
    const settingID = 'SETTING_ONE';
    mockFetch();

    const response = await tibboSettings.set(deviceAddress, settingID, 1);

    expect(response).toEqual({ deviceAddress, settingID, didSucceed: true });
  });

  test('set settings', async () => {
    const tibboSettings = new TibboSettings();

    mockFetch();

    const updatedSettings = {
      SETTING_ONE: 1,
      SETTING_NAME1: 3,
    };

    const response = await tibboSettings.setMultiple(
      'http://0.0.0.0',
      updatedSettings,
    );

    const responseSettingOne = {
      settingID: 'SETTING_ONE',
      deviceAddress: 'http://0.0.0.0',
      didSucceed: true,
    };

    const responseSettingTwo = {
      settingID: 'SETTING_NAME1',
      deviceAddress: 'http://0.0.0.0',
      didSucceed: true,
    };

    expect(response).toEqual([responseSettingOne, responseSettingTwo]);
  });

  test('set invalid setting', async () => {
    const tibboSettings = new TibboSettings();

    await expect(
      tibboSettings.set('http://0.0.0.0', 'SETTING_INVALID', 1),
    ).rejects.toThrow(Error);
  });

  test('set multiple settings that do not exist', async () => {
    const tibboSettings = new TibboSettings();

    const updatedSettings = {
      BAD_SETTING_ONE: 4,
      BAD_SETTING_TWO: 257,
    };

    await expect(
      tibboSettings.setMultiple('http://0.0.0.0', updatedSettings),
    ).rejects.toThrow(Error);
  });

  test('set multiple invalid setting', async () => {
    const tibboSettings = new TibboSettings();

    const updatedSettings = {
      SETTING_ONE: 4,
      SETTING_NAME1: 257,
    };

    await expect(
      tibboSettings.setMultiple('http://0.0.0.0', updatedSettings),
    ).rejects.toThrow(Error);
  });

  test('set setting invalid value', async () => {
    const tibboSettings = new TibboSettings();

    mockFetch();

    await expect(
      tibboSettings.set('http://0.0.0.0', 'SETTING_ONE', 2),
    ).rejects.toThrow(Error);
  });

  test('get setting', async () => {
    const tibboSettings = new TibboSettings();

    mockFetch();

    const response = await tibboSettings.get('http://0.0.0.0', 'SETTING_ONE');

    expect(response.id).toEqual(`SETTING_ONE`);
    expect(response.rawValue).toEqual(1);
    expect(response.value).toEqual('On');
  });

  test('export settings', async () => {
    const tibboSettings = new TibboSettings();

    mockFetch();

    const response = await tibboSettings.export('http://0.0.0.0');
    const exportString = JSON.parse(`{"SETTING_ONE":1,"SETTING_NAME1":1,"stg2":0}`);

    expect(response).toEqual(exportString);
  });

  test('import settings', async () => {
    const tibboSettings = new TibboSettings();

    mockFetch();

    const exportString = `{"SETTING_ONE":1,"SETTING_NAME1":1,"stg2":0}`;
    const response = await tibboSettings.import('http://0.0.0.0', exportString);

    const responseSettingOne = {
      settingID: 'SETTING_ONE',
      deviceAddress: 'http://0.0.0.0',
      didSucceed: true,
    };

    const responseSettingTwo = {
      settingID: 'SETTING_NAME1',
      deviceAddress: 'http://0.0.0.0',
      didSucceed: true,
    };

    const responseSettingThree = {
      settingID: 'stg2',
      deviceAddress: 'http://0.0.0.0',
      didSucceed: true,
    };

    expect(response).toEqual([
      responseSettingOne,
      responseSettingTwo,
      responseSettingThree,
    ]);
  });

  test('get invalid setting', async () => {
    const tibboSettings = new TibboSettings();

    await expect(
      tibboSettings.get('http://0.0.0.0', 'SETTING_INVALID'),
    ).rejects.toThrow(Error);
  });

  test('initialize settings', async () => {
    const tibboSettings = new TibboSettings();
    const deviceAddress = 'http://0.0.0.0';
    const response = await tibboSettings.initialize(deviceAddress);

    expect(response).toEqual({ deviceAddress, didSucceed: true });
  });
});
