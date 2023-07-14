import { TibboTable } from '../types/tables/tibbo-table';
export declare class TibboTables {
    /**
     * Get the tables on the Tibbo device given the IP address
     * @param deviceAddress
     */
    get(deviceAddress: string): Promise<TibboTable[]>;
    /**
     * Get the rows of the given table
     * @param deviceAddress
     * @param tableName
     */
    getRows(deviceAddress: string, tableName: string): Promise<import("..").TibboRow[]>;
    /**
     * Delete a row by its ID on the given table
     * @param rowID
     * @param deviceAddress
     * @param tableName
     */
    deleteRow(rowID: number, deviceAddress: string, tableName: string): Promise<boolean>;
    /**
     * Add a row to the given table
     * @param rowData
     * @param deviceAddress
     * @param tableName
     */
    addRow(rowData: string, deviceAddress: string, tableName: string): Promise<boolean>;
    private _getTables;
    private _getTableRows;
}
