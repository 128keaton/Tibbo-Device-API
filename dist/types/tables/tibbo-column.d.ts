export declare class TibboColumn {
    readonly displayName: string;
    readonly identifier: string;
    readonly min: number;
    readonly max: number;
    readonly dataType: string;
    /**
     * ID,S,0,50,0,43,Credential ID,
     * @param rawString
     */
    constructor(rawString: string);
}
