import {TibboSettingGroup} from "../../lib";

describe('test TibboSettingGroup', () => {
    test('basic setting group', () => {
        const setting = new TibboSettingGroup({
            id: 'group1',
            displayName: 'General'
        });

        expect(setting.id).toEqual('group1');
        expect(setting.displayName).toEqual('General');
    })
})
