import { TibboRequests } from './tibbo-requests';
import { RawTibboInfo } from './types/query/raw-tibbo-info';
import { TibboInfo } from './types';

export class TibboQuery {
  public async query(
    deviceAddress: string,
    auth?: {
      username: string;
      password: string;
    },
  ) {
    const queryRef = await TibboRequests.getPlainRequest(
      deviceAddress,
      {
        e: 'i',
        action: 'get',
        p: '',
      },
      auth,
    );

    const raw: RawTibboInfo = JSON.parse(queryRef);

    return new TibboInfo(raw);
  }
}
