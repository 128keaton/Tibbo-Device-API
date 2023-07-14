export class TibboRow {
  public readonly rowID: number;
  private columnValues: { [key: string]: unknown } = {};

  /**
   * Create a new TibboRow object
   * @param rawString A string like 'ROW_ID,Column1,Column2,Column3'
   * @param columnIDs A string array of column identifiers
   */
  constructor(rawString: string, columnIDs: string[]) {
    const splitRow = rawString.split(',');

    if (splitRow.length <= 1) throw new Error(`Invalid row: ${rawString}`);

    this.rowID = Number(splitRow.shift());

    columnIDs.forEach((columnID, index) => {
      this.columnValues[columnID] = splitRow[index];
    });
  }

  /**
   * Returns the value for the column ID
   * @param columnID Identifier of the column
   * @returns whatever value is associated with the column
   */
  public getValue(columnID: string) {
    return this.columnValues[columnID];
  }

  /**
   * Returns for the value for the column at the specified index
   * @param index Index of the column
   * @returns whatever value is associated with the column
   */
  public getValueAtIndex(index: number) {
    return Object.values(this.columnValues)[index];
  }
}
