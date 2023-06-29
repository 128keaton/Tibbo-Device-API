"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TibboDeviceAPI = void 0;
const kb_burly_1 = require("kb-burly");
const node_fetch_1 = __importDefault(require("node-fetch"));
const commander_1 = require("commander");
const tibbo_table_1 = require("./types/tables/tibbo-table");
class TibboDeviceAPI {
    async getTables(deviceAddress) {
        const tablesMetaResponse = await this.getPlainRequest(deviceAddress, {
            e: 't',
            a: 'get',
            type: 'table',
            p: ''
        });
        const tables = tablesMetaResponse.split(',\r\n').map(raw => new tibbo_table_1.TibboTable(raw));
        await Promise.all(tables.map(table => {
            return this.getPlainRequest(deviceAddress, {
                e: 't',
                p: '',
                a: 'rows',
                table: table.name
            }).then(rowsResponse => {
                rowsResponse.split('\r\n').slice(1).forEach(raw => {
                    if (raw.length)
                        table.addRow(raw);
                });
            });
        }));
        return tables;
    }
    getPlainRequest(deviceAddress, request) {
        let requestURL = (0, kb_burly_1.Burly)(`http://${deviceAddress}/api.html`);
        Object.keys(request).forEach((key) => {
            requestURL = requestURL.addQuery(key, request[key]);
        });
        return (0, node_fetch_1.default)(requestURL.get).then(response => response.text());
    }
}
exports.TibboDeviceAPI = TibboDeviceAPI;
if (require.main == module) {
    const deviceAPI = new TibboDeviceAPI();
    commander_1.program.name('tibbo-device-api')
        .version('0.0.1');
    commander_1.program
        .command('tables')
        .description('Fetch tables from a Tibbo device')
        .argument('<ipAddress>', 'IP address of Tibbo device to fetch tables from')
        .action((ipAddress) => {
        return deviceAPI.getTables(ipAddress).then(result => console.log(JSON.stringify(result, null, 2)));
    });
    commander_1.program.parse();
}
