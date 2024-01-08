"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboFunctions = void 0;
const tibbo_requests_1 = require("./tibbo-requests");
class TibboFunctions {
    tibboRequests = tibbo_requests_1.TibboRequests.getInstance();
    login(deviceAddress, password) {
        return this.tibboRequests.login(deviceAddress, password);
    }
    reboot(deviceAddress, devicePassword) {
        const controller = new AbortController();
        return new Promise(async (resolve) => {
            setTimeout(() => {
                controller.abort('timeout');
                resolve(true);
            }, 1000);
            try {
                await this.tibboRequests.postPlainRequest(deviceAddress, {
                    e: 's',
                    a: 'cmd',
                    cmd: 'E',
                }, 1000, controller, devicePassword);
            }
            catch (e) {
                if (e.type !== 'aborted') {
                    throw e;
                }
            }
        });
    }
    runCommand(deviceAddress, commandName, commandInput, devicePassword) {
        return this.tibboRequests
            .postPlainRequest(deviceAddress, {
            e: 'f',
            action: 'SET',
            variable: commandName,
            value: commandInput || 'undefined',
        }, undefined, undefined, devicePassword)
            .then((result) => result.ok);
    }
}
exports.TibboFunctions = TibboFunctions;
