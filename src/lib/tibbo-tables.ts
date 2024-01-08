import { TibboTable } from './types';
import { TibboRequests } from './tibbo-requests';

export class TibboTables {
  private tibboRequests: TibboRequests = TibboRequests.getInstance();

  /**
   * Get the tables on the Tibbo device given the IP address
   * @param deviceAddress The IP address of the Tibbo device
   * @param devicePassword
   * @returns array of TibboTable
   */
  public async get(deviceAddress: string, devicePassword?: string) {
    const tables = await this._getTables(deviceAddress, devicePassword);

    return await Promise.all(
      tables.map((table) =>
        this._getTableRows(deviceAddress, table, devicePassword),
      ),
    );
  }

  /**
   * Get the rows of the given table
   * @param deviceAddress The IP address of the Tibbo device
   * @param tableName The table name
   * @param devicePassword
   * @returns array of TibboRow
   */
  public async getRows(
    deviceAddress: string,
    tableName: string,
    devicePassword?: string,
  ) {
    const tables = await this._getTables(deviceAddress, devicePassword);
    const table = tables.find((table) => table.name === tableName);

    if (!table)
      throw new Error(
        `Could not find table named '${tableName}' in '${tables
          .map((t) => t.name)
          .join(',')}'`,
      );

    return this._getTableRows(deviceAddress, table, devicePassword).then(
      (table) => table.rows,
    );
  }

  /**
   * Delete a row by its ID on the given table
   * @param rowID The row's ID
   * @param deviceAddress The IP address of the Tibbo device
   * @param tableName The table name
   * @param devicePassword
   * @returns true if deleted
   */
  public deleteRow(
    rowID: number,
    deviceAddress: string,
    tableName: string,
    devicePassword?: string,
  ) {
    return this.tibboRequests
      .postPlainRequest(
        deviceAddress,
        {
          e: 't',
          a: 'delete',
          row: rowID,
          table: tableName,
        },
        undefined,
        undefined,
        devicePassword,
      )
      .then((response) => response.ok);
  }

  /**
   * Add a row to the given table
   * @param rowData Row data in comma separated form i.e 'COL1,COL2'
   * @param deviceAddress The IP address of the Tibbo device
   * @param tableName The table name
   * @param devicePassword
   * @returns true if added
   */
  public addRow(
    rowData: string,
    deviceAddress: string,
    tableName: string,
    devicePassword?: string,
  ) {
    return this.tibboRequests
      .postPlainRequest(
        deviceAddress,
        {
          e: 't',
          a: 'add',
          row: rowData,
          table: tableName,
        },
        undefined,
        undefined,
        devicePassword,
      )
      .then((response) => response.ok);
  }

  /**
   * Add a structured row to the given table
   *
   * @param rowData A key/value object of a row like {"COL1":"value"}
   * @param deviceAddress The IP address of the Tibbo device
   * @param tableName The table name
   *
   * @param devicePassword
   * @returns true if added
   */
  public async addRowData(
    rowData: { [key: string]: any },
    deviceAddress: string,
    tableName: string,
    devicePassword?: string,
  ) {
    const tables = await this._getTables(deviceAddress, devicePassword);
    const table = tables.find((table) => table.name === tableName);

    if (!table)
      throw new Error(
        `Could not find table named '${tableName}' in '${tables
          .map((t) => t.name)
          .join(',')}'`,
      );

    const rowArray: string[] = [];

    table.columns.forEach((col) => {
      rowArray.push(rowData[col.identifier]);
    });

    return this.tibboRequests
      .postPlainRequest(
        deviceAddress,
        {
          e: 't',
          a: 'add',
          row: rowArray.join(','),
          table: tableName,
        },
        undefined,
        undefined,
        devicePassword,
      )
      .then((response) => response.ok);
  }

  /** @internal **/
  private async _getTables(deviceAddress: string, devicePassword?: string) {
    const tablesMetaResponse = await this.tibboRequests.getPlainRequest(
      deviceAddress,
      {
        e: 't',
        a: 'get',
        type: 'table',
      },
      devicePassword,
    );

    return tablesMetaResponse
      .split(',\r\n')
      .filter((raw) => raw.length > 0)
      .map((raw) => new TibboTable(raw));
  }

  /** @internal **/
  private async _getTableRows(
    deviceAddress: string,
    table: TibboTable,
    devicePassword?: string,
  ) {
    return this.tibboRequests
      .getPlainRequest(
        deviceAddress,
        {
          e: 't',
          a: 'rows',
          table: table.name,
        },
        devicePassword,
      )
      .then((response) => {
        response
          .split('\r\n')
          .slice(1)
          .forEach((raw) => {
            if (raw.length) table.addRow(raw);
          });

        return table;
      });
  }
}
