import { TibboRequests } from './tibbo-requests';

export class TibboFunctions {
  public reboot(
    deviceAddress: string,
    auth?: {
      username: string;
      password: string;
    },
  ): Promise<boolean> {
    const controller = new AbortController();

    return new Promise(async (resolve) => {
      setTimeout(() => {
        controller.abort('timeout');
        resolve(true);
      }, 1000);

      try {
        await TibboRequests.postPlainRequest(
          deviceAddress,
          {
            p: '',
            e: 's',
            a: 'cmd',
            cmd: 'E',
          },
          1000,
          controller,
          auth,
        );
      } catch (e: any) {
        if (e.type !== 'aborted') {
          throw e;
        }
      }
    });
  }

  public runCommand(
    deviceAddress: string,
    commandName: string,
    commandInput?: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    return TibboRequests.postPlainRequest(
      deviceAddress,
      {
        p: '',
        e: 'f',
        action: 'SET',
        variable: commandName,
        value: commandInput || 'undefined',
      },
      undefined,
      undefined,
      auth,
    ).then((result) => result.ok);
  }
}
