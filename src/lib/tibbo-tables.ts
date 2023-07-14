import { TibboTable } from '../types/tables/tibbo-table';
import { TibboRequests } from './tibbo-requests';

export class TibboTables {
  /**
   * Get the tables on the Tibbo device given the IP address
   * @param deviceAddress
   */
  public async get(deviceAddress: string) {
    const tables = await this._getTables(deviceAddress);

    return await Promise.all(
      tables.map((table) => this._getTableRows(deviceAddress, table)),
    );
  }

  /**
   * Get the rows of the given table
   * @param deviceAddress
   * @param tableName
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
   * @param rowID
   * @param deviceAddress
   * @param tableName
   */
  public deleteRow(rowID: number, deviceAddress: string, tableName: string) {
    return TibboRequests.postPlainRequest(deviceAddress, {
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
  public addRow(rowData: string, deviceAddress: string, tableName: string) {
    return TibboRequests.postPlainRequest(deviceAddress, {
      p: null,
      e: 't',
      a: 'add',
      row: rowData,
      table: tableName,
    }).then((response) => response === '');
  }

  private async _getTables(deviceAddress: string) {
    const tablesMetaResponse = await TibboRequests.getPlainRequest(
      deviceAddress,
      {
        e: 't',
        a: 'get',
        type: 'table',
        p: '',
      },
    );

    return tablesMetaResponse.split(',\r\n').map((raw) => new TibboTable(raw));
  }

  private async _getTableRows(deviceAddress: string, table: TibboTable) {
    return TibboRequests.getPlainRequest(deviceAddress, {
      e: 't',
      p: '',
      a: 'rows',
      table: table.name,
    }).then((response) => {
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
