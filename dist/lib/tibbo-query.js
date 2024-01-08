"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboQuery = void 0;
const tibbo_requests_1 = require("./tibbo-requests");
const types_1 = require("./types");
class TibboQuery {
    tibboRequests = tibbo_requests_1.TibboRequests.getInstance();
    /**
     * Sends a query request to the Tibbo device with the specified address and optional device password.
     *
     * @param {string} deviceAddress - The address of the Tibbo device.
     * @param {string} [devicePassword] - The password of the Tibbo device. This parameter is optional.
     *
     * @returns {Promise<TibboInfo>} A Promise that resolves with the TibboInfo object containing the query response.
     */
    async query(deviceAddress, devicePassword) {
        const queryRef = await this.tibboRequests.getPlainRequest(deviceAddress, {
            e: 'i',
            action: 'get',
        }, devicePassword);
        const raw = JSON.parse(queryRef);
        return new types_1.TibboInfo(raw);
    }
}
exports.TibboQuery = TibboQuery;
