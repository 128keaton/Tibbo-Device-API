import { TibboRow } from './tibbo-row';
import { TibboColumn } from './tibbo-column';

export class TibboTable {
  public readonly name: string;
  public readonly columns: TibboColumn[] = [];
  public readonly rowCount: number;
  public rows: TibboRow[] = [];

  /**
   * Return the column identifiers
   * @returns array of column identifier strings
   */
  public get columnIDs() {
    return this.columns.map((column) => column.identifier);
  }

  /**
   * Create a new TibboTable
   * @param rawDefinitionString A string like 'CREDS|table|0|ID,S,0,50,0,43,Credential ID,|RAW,S,0,50,0,73,Raw Credential'
   */
  constructor(rawDefinitionString: string) {
    if (!rawDefinitionString.includes('|') || rawDefinitionString.length === 0)
      throw new Error(
        `Invalid table definition string: ${rawDefinitionString}`,
      );

    const definitions = rawDefinitionString.split('|');
    this.name = definitions[0];
    this.rowCount = Number(definitions[2]);
    this.columns = definitions.slice(3).map((raw) => new TibboColumn(raw));
  }

  /**
   * Used for building the TibboTable object
   * @internal
   * @param rawString
   */
  public addRow(rawString: string) {
    this.rows.push(new TibboRow(rawString, this.columnIDs));
  }
}
