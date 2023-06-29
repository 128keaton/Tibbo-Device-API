import {Burly} from "kb-burly";
import fetch from "node-fetch";
import {program} from "commander";
import {TibboTable} from "./types/tables/tibbo-table";

export class TibboDeviceAPI {
    public async getTables(deviceAddress: string) {
        const tablesMetaResponse = await this.getPlainRequest(deviceAddress, {
            e: 't',
            a: 'get',
            type: 'table',
            p: ''
        });


        const tables = tablesMetaResponse.split(',\r\n').map(raw => new TibboTable(raw));


        await Promise.all(
            tables.map(table => {
                return this.getPlainRequest(deviceAddress, {
                    e: 't',
                    p: '',
                    a: 'rows',
                    table: table.name
                }).then(rowsResponse => {

                    rowsResponse.split('\r\n').slice(1).forEach(raw => {
                        if (raw.length) table.addRow(raw);
                    });
                })

            })
        )

        return tables;
    }

    private getPlainRequest(deviceAddress: string, request: { [key: string]: string, e: string, p: string }) {
        let requestURL = Burly(`http://${deviceAddress}/api.html`);

        Object.keys(request).forEach((key) => {
            requestURL = requestURL.addQuery(key, request[key])
        });


        return fetch(requestURL.get).then(response => response.text())
    }
}

if (require.main == module) {
    const deviceAPI = new TibboDeviceAPI();

    program.name('tibbo-device-api')
        .version('0.0.1')

    program
        .command('tables')
        .description('Fetch tables from a Tibbo device')
        .argument('<ipAddress>', 'IP address of Tibbo device to fetch tables from')
        .action((ipAddress) => {
            return deviceAPI.getTables(ipAddress).then(result => console.log(JSON.stringify(result, null, 2)))
        });

    program.parse();
}
