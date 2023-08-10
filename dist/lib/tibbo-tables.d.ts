import { TibboTable } from './types';
export declare class TibboTables {
    /**
     * Get the tables on the Tibbo device given the IP address
     * @param deviceAddress The IP address of the Tibbo device
     * @returns array of TibboTable
     */
    get(deviceAddress: string): Promise<TibboTable[]>;
    /**
     * Get the rows of the given table
     * @param deviceAddress The IP address of the Tibbo device
     * @param tableName The table name
     * @returns array of TibboRow
     */
    getRows(deviceAddress: string, tableName: string): Promise<import("./types").TibboRow[]>;
    /**
     * Delete a row by its ID on the given table
     * @param rowID The row's ID
     * @param deviceAddress The IP address of the Tibbo device
     * @param tableName The table name
     * @returns true if deleted
     */
    deleteRow(rowID: number, deviceAddress: string, tableName: string): Promise<boolean>;
    /**
     * Add a row to the given table
     * @param rowData Row data in comma separated form i.e 'COL1,COL2'
     * @param deviceAddress The IP address of the Tibbo device
     * @param tableName The table name
     * @returns true if added
     */
    addRow(rowData: string, deviceAddress: string, tableName: string): Promise<boolean>;
    /**
     * Add a structured row to the given table
     *
     * @param rowData A key/value object of a row like {"COL1":"value"}
     * @param deviceAddress The IP address of the Tibbo device
     * @param tableName The table name
     *
     * @returns true if added
     */
    addRowData(rowData: {
        [key: string]: any;
    }, deviceAddress: string, tableName: string): Promise<boolean>;
    /** @internal **/
    private _getTables;
    /** @internal **/
    private _getTableRows;
}
