"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboTables = void 0;
const tibbo_table_1 = require("../types/tables/tibbo-table");
const tibbo_requests_1 = require("./tibbo-requests");
class TibboTables {
    /**
     * Get the tables on the Tibbo device given the IP address
     * @param deviceAddress
     */
    async get(deviceAddress) {
        const tables = await this._getTables(deviceAddress);
        return await Promise.all(tables.map((table) => this._getTableRows(deviceAddress, table)));
    }
    /**
     * Get the rows of the given table
     * @param deviceAddress
     * @param tableName
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
     * @param rowID
     * @param deviceAddress
     * @param tableName
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
     * @param rowData
     * @param deviceAddress
     * @param tableName
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
    async _getTables(deviceAddress) {
        const tablesMetaResponse = await tibbo_requests_1.TibboRequests.getPlainRequest(deviceAddress, {
            e: 't',
            a: 'get',
            type: 'table',
            p: '',
        });
        return tablesMetaResponse.split(',\r\n').map((raw) => new tibbo_table_1.TibboTable(raw));
    }
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
