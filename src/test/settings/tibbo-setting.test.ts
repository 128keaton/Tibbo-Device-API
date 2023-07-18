import {TibboSetting} from "../../lib";


describe('test TibboSetting', () => {
    test('basic setting', () => {
        const setting = new TibboSetting('value1', {
            id: 'setting1',
            type: 'STRING',
            control: 'STATIC',
        });

        expect(setting.value).toEqual('value1');
        expect(setting.id).toEqual('setting1');
        expect(setting.validateValue('value2')).toEqual(null);
        expect(setting.mapValue('value2')).toEqual('value2');
    })

    test('mapped value setting', () => {
        const setting = new TibboSetting(0, {
            id: 'setting1',
            type: 'STRING',
            control: 'STATIC',
            valueMapping: {
                0: 'Nope',
                1: 'Yep'
            }
        });

        expect(setting.value).toEqual('Nope');
        expect(setting.mapValue(1)).toEqual('Yep');
        expect(setting.rawValue).toEqual(0);
    });

    test('validation number setting', () => {
        const setting = new TibboSetting(3, {
            id: 'setting1',
            type: 'STRING',
            control: 'STATIC',
            valueMapping: {
                0: 'Nope',
                1: 'Yep'
            },
            validation: {
                greaterThan: 2,
                lessThan: 5,
                message: 'Oops! Value has to be greater than 2 and less than 5'
            }
        });

        expect(setting.validateValue(3)).toEqual(null);
        expect(setting.validateValue(1)).toEqual('Oops! Value has to be greater than 2 and less than 5');
    });

    test('validation string setting', () => {
        const setting = new TibboSetting('3', {
            id: 'setting1',
            type: 'STRING',
            control: 'STATIC',
            valueMapping: {
                0: 'Nope',
                1: 'Yep'
            },
            validation: {
                greaterThan: 0,
                lessThan: 2,
                message: 'Oops! Value length has to be greater than 0 and less than 2'
            }
        });

        expect(setting.validateValue('A')).toEqual(null);
        expect(setting.validateValue('AAA')).toEqual('Oops! Value length has to be greater than 0 and less than 2');
    });


})
