import { TibboRow } from './tibbo-row';
import { TibboColumn } from './tibbo-column';
export declare class TibboTable {
    readonly name: string;
    readonly columns: TibboColumn[];
    readonly rowCount: number;
    rows: TibboRow[];
    /**
     * Return the column identifiers
     * @returns array of column identifier strings
     */
    get columnIDs(): string[];
    /**
     * Create a new TibboTable
     * @param rawDefinitionString A string like 'CREDS|table|0|ID,S,0,50,0,43,Credential ID,|RAW,S,0,50,0,73,Raw Credential'
     */
    constructor(rawDefinitionString: string);
    /**
     * Used for building the TibboTable object
     * @internal
     * @param rawString
     */
    addRow(rawString: string): void;
}
