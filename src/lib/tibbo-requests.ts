import { Burly } from 'kb-burly';
import fetch from 'node-fetch';
import * as crypto from 'crypto';
import { TibboAuth } from './types/auth';

/** @internal */
export class TibboRequests {
  private static instance: TibboRequests | undefined = undefined;

  private auth: TibboAuth[];

  private constructor() {
    this.auth = [];
  }

  static getInstance(): TibboRequests {
    if (!TibboRequests.instance) {
      TibboRequests.instance = new TibboRequests();
    }

    return TibboRequests.instance;
  }

  public async login(deviceAddress: string, password: string) {
    const response = await this.getPlainRequest(deviceAddress, {
      e: 'a',
      action: 'get',
    });

    const hashedPassword = crypto
      .createHash('md5')
      .update(`${password}${response}`)
      .digest('hex');

    const existingAuth = this.auth.find(
      (auth) => auth.deviceAddress === deviceAddress,
    );

    if (!!existingAuth) {
      existingAuth.hashedPassword = hashedPassword;
      existingAuth.lastAuthResponse = response;
    } else {
      this.auth.push({
        deviceAddress,
        hashedPassword,
        lastAuthResponse: response,
        devicePassword: password,
      });
    }

    return hashedPassword;
  }

  public async getPlainRequest(
    deviceAddress: string,
    request: { [key: string]: string; e: string },
    devicePassword?: string,
  ) {
    let requestURL = Burly(`http://${deviceAddress}/api.html`);

    Object.keys(request).forEach((key) => {
      requestURL = requestURL.addQuery(key, request[key]);
    });

    if (!!devicePassword) {
      const hashedPassword = await this.login(deviceAddress, devicePassword);
      requestURL = requestURL.addQuery('p', hashedPassword);
    } else {
      const auth = this.getAuth(deviceAddress);

      if (!!auth && !!auth.hashedPassword) {
        requestURL = requestURL.addQuery('p', auth.hashedPassword);
      }
    }

    const response = await fetch(requestURL.get);
    return await response.text();
  }

  public async postPlainRequest(
    deviceAddress: string,
    request: {
      [key: string]: string | number | null;
      e: string;
    },
    timeout?: number,
    abortController?: AbortController,
    devicePassword?: string,
  ) {
    const requestURL = Burly(`http://${deviceAddress}/api.html`);

    const query = new URLSearchParams();

    const controller = abortController || new AbortController();
    const signal = controller.signal;

    Object.keys(request).forEach((key) => {
      const value = request[key];

      if (value !== null) query.append(key, `${request[key]}`);
    });

    if (!!devicePassword) {
      const hashedPassword = await this.login(deviceAddress, devicePassword);
      query.append('p', hashedPassword);
    } else {
      const auth = this.getAuth(deviceAddress);

      if (!!auth && !!auth.hashedPassword) {
        query.append('p', auth.hashedPassword);
      }
    }

    return fetch(requestURL.get, {
      method: 'POST',
      body: query.toString(),
      timeout,
      signal,
    });
  }

  private getAuth(deviceAddress: string) {
    return this.auth.find((auth) => auth.deviceAddress === deviceAddress);
  }
}
