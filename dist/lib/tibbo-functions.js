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
                    console.error(err);
                    return;
                }
                resolve(true);
            })
                .then(() => resolve(false));
        });
    }
}
exports.TibboFunctions = TibboFunctions;
