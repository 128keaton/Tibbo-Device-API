import { TibboRequests } from './tibbo-requests';

export class TibboFunctions {
  public reboot(deviceAddress: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);

      TibboRequests.postPlainRequest(
        deviceAddress,
        {
          p: '',
          e: 's',
          a: 'cmd',
          cmd: 'E',
        },
        500,
      )
        .catch((err) => {
          // We expect this since the device just dies immediately
          if (err.type !== 'request-timeout') {
            resolve(false);
            console.error(err);
            return;
          }

          resolve(true);
        })
        .then(() => resolve(false));
    });
  }
}
