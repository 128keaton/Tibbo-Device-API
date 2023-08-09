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
            return err;
          }

          resolve(true);
        })
        .then((response) => resolve(response.ok));
    });
  }

  public runCommand(
    deviceAddress: string,
    commandName: string,
    commandInput?: string,
  ) {
    return TibboRequests.postPlainRequest(deviceAddress, {
      p: '',
      e: 'f',
      action: 'SET',
      variable: commandName,
      value: commandInput || 'undefined',
    }).then((result) => result.ok);
  }
}
