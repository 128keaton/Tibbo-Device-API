import {TibboRow, TibboTable} from "../../lib";
import {rawTableOne} from "../test-consts";

describe('test TibboTable', () => {
    test('invalid table', () => {
        expect(() => {
            new TibboTable('')
        }).toThrow(Error);
    })

    test('valid table', () => {
        const table = new TibboTable(rawTableOne)

        expect(table.name).toEqual('CREDS');
        expect(table.rowCount).toEqual(1);
        expect(table.columnIDs).toEqual(['ID', 'RAW']);
    });

    test('add table row', () => {
        const table = new TibboTable(rawTableOne)
        table.addRow('0,1,1234');

        expect(table.name).toEqual('CREDS');
        expect(table.columnIDs).toEqual(['ID', 'RAW']);
        expect(table.rowCount).toEqual(1);
        expect(table.rows[0]).toEqual(new TibboRow('0,1,1234', ['ID', 'RAW']))
    });
})
