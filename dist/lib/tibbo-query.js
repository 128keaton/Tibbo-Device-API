"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboQuery = void 0;
const tibbo_requests_1 = require("./tibbo-requests");
const types_1 = require("./types");
class TibboQuery {
    async query(deviceAddress) {
        const queryRef = await tibbo_requests_1.TibboRequests.getPlainRequest(deviceAddress, {
            e: 'i',
            action: 'get',
            p: '',
        });
        const raw = JSON.parse(queryRef);
        return new types_1.TibboInfo(raw);
    }
}
exports.TibboQuery = TibboQuery;
