import { TibboInfo } from './types';
export declare class TibboQuery {
    private tibboRequests;
    /**
     * Sends a query request to the Tibbo device with the specified address and optional device password.
     *
     * @param {string} deviceAddress - The address of the Tibbo device.
     * @param {string} [devicePassword] - The password of the Tibbo device. This parameter is optional.
     *
     * @returns {Promise<TibboInfo>} A Promise that resolves with the TibboInfo object containing the query response.
     */
    query(deviceAddress: string, devicePassword?: string): Promise<TibboInfo>;
}
