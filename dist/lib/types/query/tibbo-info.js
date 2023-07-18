"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboInfo = void 0;
class TibboInfo {
    firmwareVersion;
    time;
    timezone;
    uptime;
    wifiOn;
    network;
    constructor(raw) {
        this.firmwareVersion = raw.firmwareVersion;
        this.time = Number(raw.time);
        this.timezone = Number(raw.timezone);
        this.uptime = Number(raw.uptime);
        this.wifiOn = raw.wifiOn === '1';
        this.network = {
            wifi: {
                ipAddress: raw.wlnip,
                macAddress: raw.wlnmac,
            },
            eth: {
                ipAddress: raw.ip,
                macAddress: raw.mac,
            },
        };
    }
}
exports.TibboInfo = TibboInfo;
