import { TibboRow } from "./tibbo-row";
import { TibboColumn } from "./tibbo-column";
export declare class TibboTable {
    readonly name: string;
    readonly columns: TibboColumn[];
    readonly rowCount: number;
    rows: TibboRow[];
    get columnIDs(): string[];
    /**
     * CREDS|table|0|ID,S,0,50,0,43,Credential ID,|RAW,S,0,50,0,73,Raw Credential
     * @param rawDefinitionString
     */
    constructor(rawDefinitionString: string);
    addRow(rawString: string): void;
}
