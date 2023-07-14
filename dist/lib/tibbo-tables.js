"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboTables = void 0;
const types_1 = require("./types");
const tibbo_requests_1 = require("./tibbo-requests");
class TibboTables {
    /**
     * Get the tables on the Tibbo device given the IP address
     * @param deviceAddress The IP address of the Tibbo device
     * @returns array of TibboTable
     */
    async get(deviceAddress) {
        const tables = await this._getTables(deviceAddress);
        return await Promise.all(tables.map((table) => this._getTableRows(deviceAddress, table)));
    }
    /**
     * Get the rows of the given table
     * @param deviceAddress The IP address of the Tibbo device
     * @param tableName The table name
     * @returns array of TibboRow
     */
    async getRows(deviceAddress, tableName) {
        const tables = await this._getTables(deviceAddress);
        const table = tables.find((table) => table.name === tableName);
        if (!table)
            throw new Error(`Could not find table named '${tableName}' in '${tables
                .map((t) => t.name)
                .join(',')}'`);
        return this._getTableRows(deviceAddress, table).then((table) => table.rows);
    }
    /**
     * Delete a row by its ID on the given table
     * @param rowID The row's ID
     * @param deviceAddress The IP address of the Tibbo device
     * @param tableName The table name
     * @returns true if deleted
     */
    deleteRow(rowID, deviceAddress, tableName) {
        return tibbo_requests_1.TibboRequests.postPlainRequest(deviceAddress, {
            p: null,
            e: 't',
            a: 'delete',
            row: rowID,
            table: tableName,
        }).then((response) => response === '');
    }
    /**
     * Add a row to the given table
     * @param rowData Row data in comma separated form i.e 'COL1,COL2'
     * @param deviceAddress The IP address of the Tibbo device
     * @param tableName The table name
     * @returns true if added
     */
    addRow(rowData, deviceAddress, tableName) {
        return tibbo_requests_1.TibboRequests.postPlainRequest(deviceAddress, {
            p: null,
            e: 't',
            a: 'add',
            row: rowData,
            table: tableName,
        }).then((response) => response === '');
    }
    /** @internal **/
    async _getTables(deviceAddress) {
        const tablesMetaResponse = await tibbo_requests_1.TibboRequests.getPlainRequest(deviceAddress, {
            e: 't',
            a: 'get',
            type: 'table',
            p: '',
        });
        return tablesMetaResponse.split(',\r\n').map((raw) => new types_1.TibboTable(raw));
    }
    /** @internal **/
    async _getTableRows(deviceAddress, table) {
        return tibbo_requests_1.TibboRequests.getPlainRequest(deviceAddress, {
            e: 't',
            p: '',
            a: 'rows',
            table: table.name,
        }).then((response) => {
            response
                .split('\r\n')
                .slice(1)
                .forEach((raw) => {
                if (raw.length)
                    table.addRow(raw);
            });
            return table;
        });
    }
}
exports.TibboTables = TibboTables;
