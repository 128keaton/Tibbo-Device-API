import { TibboTable } from "./types/tables/tibbo-table";
export declare class TibboDeviceAPI {
    getTables(deviceAddress: string): Promise<TibboTable[]>;
    private getPlainRequest;
}
