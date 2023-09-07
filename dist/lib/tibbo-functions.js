"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboFunctions = void 0;
const tibbo_requests_1 = require("./tibbo-requests");
class TibboFunctions {
    reboot(deviceAddress, auth) {
        const controller = new AbortController();
        return new Promise(async (resolve) => {
            setTimeout(() => {
                controller.abort('timeout');
                resolve(true);
            }, 1000);
            try {
                await tibbo_requests_1.TibboRequests.postPlainRequest(deviceAddress, {
                    p: '',
                    e: 's',
                    a: 'cmd',
                    cmd: 'E',
                }, 1000, controller, auth);
            }
            catch (e) {
                if (e.type !== 'aborted') {
                    throw e;
                }
            }
        });
    }
    runCommand(deviceAddress, commandName, commandInput, auth) {
        return tibbo_requests_1.TibboRequests.postPlainRequest(deviceAddress, {
            p: '',
            e: 'f',
            action: 'SET',
            variable: commandName,
            value: commandInput || 'undefined',
        }, undefined, undefined, auth).then((result) => result.ok);
    }
}
exports.TibboFunctions = TibboFunctions;
