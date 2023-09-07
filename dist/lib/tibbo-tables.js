"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboTables = void 0;
const types_1 = require("./types");
const tibbo_requests_1 = require("./tibbo-requests");
class TibboTables {
    /**
     * Get the tables on the Tibbo device given the IP address
     * @param deviceAddress The IP address of the Tibbo device
     * @param auth a tuple of {username, password}
     * @returns array of TibboTable
     */
    async get(deviceAddress, auth) {
        const tables = await this._getTables(deviceAddress, auth);
        return await Promise.all(tables.map((table) => this._getTableRows(deviceAddress, table, auth)));
    }
    /**
     * Get the rows of the given table
     * @param deviceAddress The IP address of the Tibbo device
     * @param tableName The table name
     * @param auth a tuple of {username, password}
     * @returns array of TibboRow
     */
    async getRows(deviceAddress, tableName, auth) {
        const tables = await this._getTables(deviceAddress, auth);
        const table = tables.find((table) => table.name === tableName);
        if (!table)
            throw new Error(`Could not find table named '${tableName}' in '${tables
                .map((t) => t.name)
                .join(',')}'`);
        return this._getTableRows(deviceAddress, table, auth).then((table) => table.rows);
    }
    /**
     * Delete a row by its ID on the given table
     * @param rowID The row's ID
     * @param deviceAddress The IP address of the Tibbo device
     * @param tableName The table name
     * @param auth a tuple of {username, password}
     * @returns true if deleted
     */
    deleteRow(rowID, deviceAddress, tableName, auth) {
        return tibbo_requests_1.TibboRequests.postPlainRequest(deviceAddress, {
            p: null,
            e: 't',
            a: 'delete',
            row: rowID,
            table: tableName,
        }, undefined, undefined, auth).then((response) => response.ok);
    }
    /**
     * Add a row to the given table
     * @param rowData Row data in comma separated form i.e 'COL1,COL2'
     * @param deviceAddress The IP address of the Tibbo device
     * @param tableName The table name
     * @param auth a tuple of {username, password}
     * @returns true if added
     */
    addRow(rowData, deviceAddress, tableName, auth) {
        return tibbo_requests_1.TibboRequests.postPlainRequest(deviceAddress, {
            p: null,
            e: 't',
            a: 'add',
            row: rowData,
            table: tableName,
        }, undefined, undefined, auth).then((response) => response.ok);
    }
    /**
     * Add a structured row to the given table
     *
     * @param rowData A key/value object of a row like {"COL1":"value"}
     * @param deviceAddress The IP address of the Tibbo device
     * @param tableName The table name
     * @param auth a tuple of {username, password}
     *
     * @returns true if added
     */
    async addRowData(rowData, deviceAddress, tableName, auth) {
        const tables = await this._getTables(deviceAddress, auth);
        const table = tables.find((table) => table.name === tableName);
        if (!table)
            throw new Error(`Could not find table named '${tableName}' in '${tables
                .map((t) => t.name)
                .join(',')}'`);
        const rowArray = [];
        table.columns.forEach((col) => {
            rowArray.push(rowData[col.identifier]);
        });
        return tibbo_requests_1.TibboRequests.postPlainRequest(deviceAddress, {
            p: null,
            e: 't',
            a: 'add',
            row: rowArray.join(','),
            table: tableName,
        }, undefined, undefined, auth).then((response) => response.ok);
    }
    /** @internal **/
    async _getTables(deviceAddress, auth) {
        const tablesMetaResponse = await tibbo_requests_1.TibboRequests.getPlainRequest(deviceAddress, {
            e: 't',
            a: 'get',
            type: 'table',
            p: '',
        }, auth);
        return tablesMetaResponse
            .split(',\r\n')
            .filter((raw) => raw.length > 0)
            .map((raw) => new types_1.TibboTable(raw));
    }
    /** @internal **/
    async _getTableRows(deviceAddress, table, auth) {
        return tibbo_requests_1.TibboRequests.getPlainRequest(deviceAddress, {
            e: 't',
            p: '',
            a: 'rows',
            table: table.name,
        }, auth).then((response) => {
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
