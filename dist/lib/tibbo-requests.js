"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboRequests = void 0;
const kb_burly_1 = require("kb-burly");
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto = __importStar(require("crypto"));
/** @internal */
class TibboRequests {
    static instance = undefined;
    auth;
    constructor() {
        this.auth = [];
    }
    static getInstance() {
        if (!TibboRequests.instance) {
            TibboRequests.instance = new TibboRequests();
        }
        return TibboRequests.instance;
    }
    async login(deviceAddress, password) {
        const response = await this.getPlainRequest(deviceAddress, {
            e: 'a',
            action: 'get',
        });
        const hashedPassword = crypto
            .createHash('md5')
            .update(`${password}${response}`)
            .digest('hex');
        const existingAuth = this.auth.find((auth) => auth.deviceAddress === deviceAddress);
        if (!!existingAuth) {
            existingAuth.hashedPassword = hashedPassword;
            existingAuth.lastAuthResponse = response;
        }
        else {
            this.auth.push({
                deviceAddress,
                hashedPassword,
                lastAuthResponse: response,
                devicePassword: password,
            });
        }
        return hashedPassword;
    }
    async getPlainRequest(deviceAddress, request, devicePassword) {
        let requestURL = (0, kb_burly_1.Burly)(`${deviceAddress}/api.html`);
        Object.keys(request).forEach((key) => {
            requestURL = requestURL.addQuery(key, request[key]);
        });
        if (!!devicePassword) {
            const hashedPassword = await this.login(deviceAddress, devicePassword);
            requestURL = requestURL.addQuery('p', hashedPassword);
        }
        else {
            const auth = this.getAuth(deviceAddress);
            if (!!auth && !!auth.hashedPassword) {
                requestURL = requestURL.addQuery('p', auth.hashedPassword);
            }
        }
        const response = await (0, node_fetch_1.default)(requestURL.get);
        return await response.text();
    }
    async postPlainRequest(deviceAddress, request, timeout, abortController, devicePassword) {
        const requestURL = (0, kb_burly_1.Burly)(`${deviceAddress}/api.html`);
        const query = new URLSearchParams();
        const controller = abortController || new AbortController();
        const signal = controller.signal;
        Object.keys(request).forEach((key) => {
            const value = request[key];
            if (value !== null)
                query.append(key, `${request[key]}`);
        });
        if (!!devicePassword) {
            const hashedPassword = await this.login(deviceAddress, devicePassword);
            query.append('p', hashedPassword);
        }
        else {
            const auth = this.getAuth(deviceAddress);
            if (!!auth && !!auth.hashedPassword) {
                query.append('p', auth.hashedPassword);
            }
        }
        return (0, node_fetch_1.default)(requestURL.get, {
            method: 'POST',
            body: query.toString(),
            timeout,
            signal,
        });
    }
    getAuth(deviceAddress) {
        return this.auth.find((auth) => auth.deviceAddress === deviceAddress);
    }
}
exports.TibboRequests = TibboRequests;
