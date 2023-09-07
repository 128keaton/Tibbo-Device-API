import { TibboTable } from './types';
import { TibboRequests } from './tibbo-requests';

export class TibboTables {
  /**
   * Get the tables on the Tibbo device given the IP address
   * @param deviceAddress The IP address of the Tibbo device
   * @returns array of TibboTable
   */
  public async get(
    deviceAddress: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const tables = await this._getTables(deviceAddress);

    return await Promise.all(
      tables.map((table) => this._getTableRows(deviceAddress, table)),
    );
  }

  /**
   * Get the rows of the given table
   * @param deviceAddress The IP address of the Tibbo device
   * @param tableName The table name
   * @returns array of TibboRow
   */
  public async getRows(deviceAddress: string, tableName: string) {
    const tables = await this._getTables(deviceAddress);
    const table = tables.find((table) => table.name === tableName);

    if (!table)
      throw new Error(
        `Could not find table named '${tableName}' in '${tables
          .map((t) => t.name)
          .join(',')}'`,
      );

    return this._getTableRows(deviceAddress, table).then((table) => table.rows);
  }

  /**
   * Delete a row by its ID on the given table
   * @param rowID The row's ID
   * @param deviceAddress The IP address of the Tibbo device
   * @param tableName The table name
   * @returns true if deleted
   */
  public deleteRow(rowID: number, deviceAddress: string, tableName: string) {
    return TibboRequests.postPlainRequest(deviceAddress, {
      p: null,
      e: 't',
      a: 'delete',
      row: rowID,
      table: tableName,
    }).then((response) => response.ok);
  }

  /**
   * Add a row to the given table
   * @param rowData Row data in comma separated form i.e 'COL1,COL2'
   * @param deviceAddress The IP address of the Tibbo device
   * @param tableName The table name
   * @returns true if added
   */
  public addRow(rowData: string, deviceAddress: string, tableName: string) {
    return TibboRequests.postPlainRequest(deviceAddress, {
      p: null,
      e: 't',
      a: 'add',
      row: rowData,
      table: tableName,
    }).then((response) => response.ok);
  }

  /**
   * Add a structured row to the given table
   *
   * @param rowData A key/value object of a row like {"COL1":"value"}
   * @param deviceAddress The IP address of the Tibbo device
   * @param tableName The table name
   *
   * @returns true if added
   */
  public async addRowData(
    rowData: { [key: string]: any },
    deviceAddress: string,
    tableName: string,
  ) {
    const tables = await this._getTables(deviceAddress);
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

    return TibboRequests.postPlainRequest(deviceAddress, {
      p: null,
      e: 't',
      a: 'add',
      row: rowArray.join(','),
      table: tableName,
    }).then((response) => response.ok);
  }

  /** @internal **/
  private async _getTables(
    deviceAddress: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const tablesMetaResponse = await TibboRequests.getPlainRequest(
      deviceAddress,
      {
        e: 't',
        a: 'get',
        type: 'table',
        p: '',
      },
      auth,
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
    auth?: {
      username: string;
      password: string;
    },
  ) {
    return TibboRequests.getPlainRequest(
      deviceAddress,
      {
        e: 't',
        p: '',
        a: 'rows',
        table: table.name,
      },
      auth,
    ).then((response) => {
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
