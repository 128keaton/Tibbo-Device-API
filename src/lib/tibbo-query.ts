import { TibboRequests } from './tibbo-requests';
import { RawTibboInfo } from './types/query/raw-tibbo-info';
import { TibboInfo } from './types';

export class TibboQuery {
  private tibboRequests: TibboRequests = TibboRequests.getInstance();

  /**
   * Sends a query request to the Tibbo device with the specified address and optional device password.
   *
   * @param {string} deviceAddress - The address of the Tibbo device.
   * @param {string} [devicePassword] - The password of the Tibbo device. This parameter is optional.
   *
   * @returns {Promise<TibboInfo>} A Promise that resolves with the TibboInfo object containing the query response.
   */
  public async query(deviceAddress: string, devicePassword?: string) {
    const queryRef = await this.tibboRequests.getPlainRequest(
      deviceAddress,
      {
        e: 'i',
        action: 'get',
      },
      devicePassword,
    );

    const raw: RawTibboInfo = JSON.parse(queryRef);

    return new TibboInfo(raw);
  }
}
