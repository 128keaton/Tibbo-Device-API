import { TibboRequests } from './tibbo-requests';

export class TibboFunctions {
  private tibboRequests: TibboRequests = TibboRequests.getInstance();

  public login(deviceAddress: string, password: string): Promise<string> {
    return this.tibboRequests.login(deviceAddress, password);
  }

  public reboot(
    deviceAddress: string,
    devicePassword?: string,
  ): Promise<boolean> {
    const controller = new AbortController();

    return new Promise(async (resolve) => {
      setTimeout(() => {
        controller.abort('timeout');
        resolve(true);
      }, 1000);

      try {
        await this.tibboRequests.postPlainRequest(
          deviceAddress,
          {
            e: 's',
            a: 'cmd',
            cmd: 'E',
          },
          1000,
          controller,
          devicePassword,
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
    devicePassword?: string,
  ) {
    return this.tibboRequests
      .postPlainRequest(
        deviceAddress,
        {
          e: 'f',
          action: 'SET',
          variable: commandName,
          value: commandInput || 'undefined',
        },
        undefined,
        undefined,
        devicePassword,
      )
      .then((result) => result.ok);
  }
}
