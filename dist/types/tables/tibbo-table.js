"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboTable = void 0;
const tibbo_row_1 = require("./tibbo-row");
const tibbo_column_1 = require("./tibbo-column");
class TibboTable {
    name;
    columns = [];
    rowCount;
    rows = [];
    get columnIDs() {
        return this.columns.map(column => column.identifier);
    }
    /**
     * CREDS|table|0|ID,S,0,50,0,43,Credential ID,|RAW,S,0,50,0,73,Raw Credential
     * @param rawDefinitionString
     */
    constructor(rawDefinitionString) {
        const definitions = rawDefinitionString.split('|');
        this.name = definitions[0];
        this.rowCount = Number(definitions[2]);
        this.columns = definitions.slice(3).map(raw => new tibbo_column_1.TibboColumn(raw));
    }
    addRow(rawString) {
        this.rows.push(new tibbo_row_1.TibboRow(rawString, this.columnIDs));
    }
}
exports.TibboTable = TibboTable;
