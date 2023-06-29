export class TibboColumn {
    public readonly displayName: string;
    public readonly identifier: string;
    public readonly min: number;
    public readonly max: number;
    public readonly dataType: string;


    /**
     * ID,S,0,50,0,43,Credential ID,
     * @param rawString
     */
    constructor(rawString: string) {
        const splitColumnDefinition = rawString.split(',');

        this.identifier = splitColumnDefinition[0];
        this.displayName = splitColumnDefinition[6];
        this.min = Number(splitColumnDefinition[2]);
        this.max = Number(splitColumnDefinition[3]);
        this.dataType = splitColumnDefinition[1];
    }
}
