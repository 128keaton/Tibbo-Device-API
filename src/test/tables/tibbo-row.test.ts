import {TibboRow} from "../../lib";

describe('test TibboRow', () => {
    test('invalid row', () => {
        expect(() => {
            new TibboRow('', [])
        }).toThrow(Error);
    })

    test('valid row', () => {
      const row =   new TibboRow('0,value-one,value-two', ['column-one', 'column-two']);

      expect(row.rowID).toEqual(0);
      expect(row.getValue('column-two')).toEqual('value-two');
        expect(row.getValueAtIndex(0)).toEqual('value-one');
    })
})
