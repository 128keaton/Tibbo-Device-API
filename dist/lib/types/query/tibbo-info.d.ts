import { RawTibboInfo } from './raw-tibbo-info';
export declare class TibboInfo {
    firmwareVersion: string;
    time: number;
    timezone: number;
    uptime: number;
    wifiOn: boolean;
    network: {
        wifi: {
            ipAddress: string;
            macAddress: string;
        };
        eth: {
            ipAddress: string;
            macAddress: string;
        };
    };
    constructor(raw: RawTibboInfo);
}
