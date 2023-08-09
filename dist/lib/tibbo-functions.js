"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboFunctions = void 0;
const tibbo_requests_1 = require("./tibbo-requests");
class TibboFunctions {
    reboot(deviceAddress) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
            tibbo_requests_1.TibboRequests.postPlainRequest(deviceAddress, {
                p: '',
                e: 's',
                a: 'cmd',
                cmd: 'E',
            }, 500)
                .catch((err) => {
                // We expect this since the device just dies immediately
                if (err.type !== 'request-timeout') {
                    resolve(false);
                    return err;
                }
                resolve(true);
            })
                .then((response) => resolve(response.ok));
        });
    }
    runCommand(deviceAddress, commandName, commandInput) {
        return tibbo_requests_1.TibboRequests.postPlainRequest(deviceAddress, {
            p: '',
            e: 'f',
            action: 'SET',
            variable: commandName,
            value: commandInput || 'undefined',
        }).then((result) => result.ok);
    }
}
exports.TibboFunctions = TibboFunctions;
