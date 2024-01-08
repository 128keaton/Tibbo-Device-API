export declare class TibboFunctions {
    private tibboRequests;
    login(deviceAddress: string, password: string): Promise<string>;
    reboot(deviceAddress: string, devicePassword?: string): Promise<boolean>;
    runCommand(deviceAddress: string, commandName: string, commandInput?: string, devicePassword?: string): Promise<boolean>;
}
