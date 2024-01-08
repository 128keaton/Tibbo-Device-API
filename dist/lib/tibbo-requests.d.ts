/// <reference types="node" />
/** @internal */
export declare class TibboRequests {
    private static instance;
    private auth;
    private constructor();
    static getInstance(): TibboRequests;
    login(deviceAddress: string, password: string): Promise<string>;
    getPlainRequest(deviceAddress: string, request: {
        [key: string]: string;
        e: string;
    }, devicePassword?: string): Promise<string>;
    postPlainRequest(deviceAddress: string, request: {
        [key: string]: string | number | null;
        e: string;
    }, timeout?: number, abortController?: AbortController, devicePassword?: string): Promise<import("node-fetch").Response>;
    private getAuth;
}
