export declare class TibboFunctions {
    reboot(deviceAddress: string): Promise<boolean>;
    runCommand(deviceAddress: string, commandName: string, commandInput?: string): Promise<boolean>;
}
