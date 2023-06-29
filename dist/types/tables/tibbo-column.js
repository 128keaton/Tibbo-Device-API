"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboColumn = void 0;
class TibboColumn {
    displayName;
    identifier;
    min;
    max;
    dataType;
    /**
     * ID,S,0,50,0,43,Credential ID,
     * @param rawString
     */
    constructor(rawString) {
        const splitColumnDefinition = rawString.split(',');
        this.identifier = splitColumnDefinition[0];
        this.displayName = splitColumnDefinition[6];
        this.min = Number(splitColumnDefinition[2]);
        this.max = Number(splitColumnDefinition[3]);
        this.dataType = splitColumnDefinition[1];
    }
}
exports.TibboColumn = TibboColumn;
