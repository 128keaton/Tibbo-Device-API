export declare class TibboRow {
    readonly rowID: number;
    private columnValues;
    /**
     * Create a new TibboRow object
     * @param rawString A string like 'ROW_ID,Column1,Column2,Column3'
     * @param columnIDs A string array of column identifiers
     */
    constructor(rawString: string, columnIDs: string[]);
    /**
     * Returns the value for the column ID
     * @param columnID Identifier of the column
     * @returns whatever value is associated with the column
     */
    getValue(columnID: string): unknown;
    /**
     * Returns for the value for the column at the specified index
     * @param index Index of the column
     * @returns whatever value is associated with the column
     */
    getValueAtIndex(index: number): unknown;
}
