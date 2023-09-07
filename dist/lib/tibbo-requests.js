"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboRequests = void 0;
const kb_burly_1 = require("kb-burly");
const node_fetch_1 = __importDefault(require("node-fetch"));
/** @internal */
class TibboRequests {
    static getPlainRequest(deviceAddress, request, auth) {
        let requestURL = (0, kb_burly_1.Burly)(`http://${deviceAddress}/api.html`);
        Object.keys(request).forEach((key) => {
            requestURL = requestURL.addQuery(key, request[key]);
        });
        let headers = {};
        if (!!auth) {
            headers = {
                Authorization: 'Basic ' +
                    Buffer.from(auth.username + ':' + auth.password).toString('base64'),
            };
        }
        return (0, node_fetch_1.default)(requestURL.get, { headers }).then((response) => response.text());
    }
    static postPlainRequest(deviceAddress, request, timeout, abortController, auth) {
        const requestURL = (0, kb_burly_1.Burly)(`http://${deviceAddress}/api.html`);
        const query = new URLSearchParams();
        const controller = abortController || new AbortController();
        const signal = controller.signal;
        Object.keys(request).forEach((key) => {
            const value = request[key];
            if (value !== null)
                query.append(key, `${request[key]}`);
        });
        let headers = {};
        if (!!auth) {
            headers = {
                Authorization: 'Basic ' +
                    Buffer.from(auth.username + ':' + auth.password).toString('base64'),
            };
        }
        return (0, node_fetch_1.default)(requestURL.get, {
            method: 'POST',
            body: query.toString(),
            timeout,
            signal,
            headers,
        });
    }
}
exports.TibboRequests = TibboRequests;
