"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboSettingGroup = void 0;
class TibboSettingGroup {
    id;
    displayName;
    settings = [];
    constructor(raw) {
        this.id = raw['id'];
        this.displayName = raw['displayName'];
    }
}
exports.TibboSettingGroup = TibboSettingGroup;
