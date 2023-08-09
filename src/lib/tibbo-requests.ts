import { Burly } from 'kb-burly';
import fetch from 'node-fetch';

/** @internal */
export class TibboRequests {
  public static getPlainRequest(
    deviceAddress: string,
    request: { [key: string]: string; e: string; p: string },
  ) {
    let requestURL = Burly(`http://${deviceAddress}/api.html`);

    Object.keys(request).forEach((key) => {
      requestURL = requestURL.addQuery(key, request[key]);
    });

    return fetch(requestURL.get).then((response) => response.text());
  }

  public static postPlainRequest(
    deviceAddress: string,
    request: {
      [key: string]: string | number | null;
      e: string;
      p: string | null;
    },
    timeout?: number,
  ) {
    const requestURL = Burly(`http://${deviceAddress}/api.html`);

    const query = new URLSearchParams();

    Object.keys(request).forEach((key) => {
      const value = request[key];

      if (value !== null) query.append(key, `${request[key]}`);
    });

    return fetch(requestURL.get, {
      method: 'POST',
      body: query.toString(),
      timeout,
    });
  }
}
