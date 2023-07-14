"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboRow = void 0;
class TibboRow {
    rowID;
    columnValues = {};
    /**
     * Create a new TibboRow object
     * @param rawString A string like 'ROW_ID,Column1,Column2,Column3'
     * @param columnIDs A string array of column identifiers
     */
    constructor(rawString, columnIDs) {
        const splitRow = rawString.split(',');
        if (splitRow.length <= 1)
            throw new Error(`Invalid row: ${rawString}`);
        this.rowID = Number(splitRow.shift());
        columnIDs.forEach((columnID, index) => {
            this.columnValues[columnID] = splitRow[index];
        });
    }
    /**
     * Returns the value for the column ID
     * @param columnID Identifier of the column
     * @returns whatever value is associated with the column
     */
    getValue(columnID) {
        return this.columnValues[columnID];
    }
    /**
     * Returns for the value for the column at the specified index
     * @param index Index of the column
     * @returns whatever value is associated with the column
     */
    getValueAtIndex(index) {
        return Object.values(this.columnValues)[index];
    }
}
exports.TibboRow = TibboRow;
