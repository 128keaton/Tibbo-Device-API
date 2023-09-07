export declare class TibboFunctions {
    reboot(deviceAddress: string, auth?: {
        username: string;
        password: string;
    }): Promise<boolean>;
    runCommand(deviceAddress: string, commandName: string, commandInput?: string, auth?: {
        username: string;
        password: string;
    }): Promise<boolean>;
}
