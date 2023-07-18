import { RawTibboInfo } from './raw-tibbo-info';

export class TibboInfo {
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

  constructor(raw: RawTibboInfo) {
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
