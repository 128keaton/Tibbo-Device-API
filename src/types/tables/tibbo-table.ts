import { TibboRow } from './tibbo-row';
import { TibboColumn } from './tibbo-column';

export class TibboTable {
  public readonly name: string;
  public readonly columns: TibboColumn[] = [];
  public readonly rowCount: number;
  public rows: TibboRow[] = [];

  public get columnIDs() {
    return this.columns.map((column) => column.identifier);
  }

  /**
   * CREDS|table|0|ID,S,0,50,0,43,Credential ID,|RAW,S,0,50,0,73,Raw Credential
   * @param rawDefinitionString
   */
  constructor(rawDefinitionString: string) {
    const definitions = rawDefinitionString.split('|');
    this.name = definitions[0];
    this.rowCount = Number(definitions[2]);
    this.columns = definitions.slice(3).map((raw) => new TibboColumn(raw));
  }

  public addRow(rawString: string) {
    this.rows.push(new TibboRow(rawString, this.columnIDs));
  }
}
