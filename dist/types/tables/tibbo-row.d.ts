export declare class TibboRow {
    readonly rowID: number;
    private columnValues;
    /**
     * Formatted like "ROW_ID,Column1,Column2,Column3 and so on
     * @param rawString
     * @param columnIDs
     */
    constructor(rawString: string, columnIDs: string[]);
    /**
     * Returns the value for the column ID
     * @param columnID
     */
    getValue(columnID: string): unknown;
    /**
     * Returns for the value for the column at the specified index
     * @param index
     */
    getValueAtIndex(index: number): unknown;
}
