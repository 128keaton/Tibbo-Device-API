/// <reference types="node" />
/** @internal */
export declare class TibboRequests {
    static getPlainRequest(deviceAddress: string, request: {
        [key: string]: string;
        e: string;
        p: string;
    }, auth?: {
        username: string;
        password: string;
    }): Promise<string>;
    static postPlainRequest(deviceAddress: string, request: {
        [key: string]: string | number | null;
        e: string;
        p: string | null;
    }, timeout?: number, abortController?: AbortController, auth?: {
        username: string;
        password: string;
    }): Promise<import("node-fetch").Response>;
}
