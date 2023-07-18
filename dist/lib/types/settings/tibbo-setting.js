"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboSetting = void 0;
class TibboSetting {
    id;
    type;
    control;
    value;
    rawValue;
    greaterThan;
    lessThan;
    invalidMessage;
    valueMapping;
    constructor(value, raw) {
        this.rawValue = value;
        this.id = raw.id;
        this.type = raw.type;
        this.control = raw.control;
        if (!!raw.validation) {
            this.greaterThan = raw.validation.greaterThan;
            this.lessThan = raw.validation.lessThan;
            this.invalidMessage = raw.validation.message;
        }
        if (!!raw.valueMapping)
            this.valueMapping = raw.valueMapping;
        this.value = !!this.valueMapping
            ? this.mapValue(this.rawValue)
            : this.rawValue;
    }
    validateValue(value) {
        if (this.greaterThan !== undefined &&
            this.lessThan !== undefined &&
            !!this.invalidMessage !== undefined) {
            if (!isNaN(Number(value))) {
                return Number(value) > this.greaterThan && Number(value) < this.lessThan
                    ? null
                    : this.invalidMessage;
            }
            else if (typeof value === 'string') {
                return `${value}`.length > this.greaterThan &&
                    `${value}`.length < this.lessThan
                    ? null
                    : this.invalidMessage;
            }
        }
        return null;
    }
    mapValue(value) {
        if (!!this.valueMapping)
            return this.valueMapping[value];
        return value;
    }
}
exports.TibboSetting = TibboSetting;
