import { TibboInfo } from './types';
export declare class TibboQuery {
    query(deviceAddress: string, auth?: {
        username: string;
        password: string;
    }): Promise<TibboInfo>;
}
