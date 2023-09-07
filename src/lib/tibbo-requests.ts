import { Burly } from 'kb-burly';
import fetch from 'node-fetch';

/** @internal */
export class TibboRequests {
  public static getPlainRequest(
    deviceAddress: string,
    request: { [key: string]: string; e: string; p: string },
    auth?: {
      username: string;
      password: string;
    },
  ) {
    let requestURL = Burly(`http://${deviceAddress}/api.html`);

    Object.keys(request).forEach((key) => {
      requestURL = requestURL.addQuery(key, request[key]);
    });

    let headers = {};

    if (!!auth) {
      headers = {
        Authorization:
          'Basic ' +
          Buffer.from(auth.username + ':' + auth.password).toString('base64'),
      };
    }

    return fetch(requestURL.get, { headers }).then((response) =>
      response.text(),
    );
  }

  public static postPlainRequest(
    deviceAddress: string,
    request: {
      [key: string]: string | number | null;
      e: string;
      p: string | null;
    },
    timeout?: number,
    abortController?: AbortController,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const requestURL = Burly(`http://${deviceAddress}/api.html`);

    const query = new URLSearchParams();

    const controller = abortController || new AbortController();
    const signal = controller.signal;

    Object.keys(request).forEach((key) => {
      const value = request[key];

      if (value !== null) query.append(key, `${request[key]}`);
    });

    let headers = {};

    if (!!auth) {
      headers = {
        Authorization:
          'Basic ' +
          Buffer.from(auth.username + ':' + auth.password).toString('base64'),
      };
    }

    return fetch(requestURL.get, {
      method: 'POST',
      body: query.toString(),
      timeout,
      signal,
      headers,
    });
  }
}
