#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const lib_1 = require("./lib");
if (require.main == module) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageInfo = require('../package.json');
    const validateDeviceAddress = (deviceAddress) => {
        if (!deviceAddress.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/))
            commander_1.program.error(`error: invalid IP address: '${deviceAddress}'`);
        return true;
    };
    commander_1.program
        .name('tibbo-device-api')
        .version(packageInfo.version)
        .argument('<ipAddress>', 'IP address of Tibbo device');
    commander_1.program
        .command('query')
        .summary('Query device info')
        .argument('<ipAddress>', 'IP address of Tibbo device')
        .action((ipAddress) => {
        validateDeviceAddress(ipAddress);
        return new lib_1.TibboQuery()
            .query(ipAddress)
            .then((result) => console.log(JSON.stringify(result, null, 2)));
    });
    const settings = commander_1.program
        .command('settings')
        .summary('Update and view settings on the device');
    settings
        .command('all')
        .summary('Get all the current settings on the device')
        .argument('<ipAddress>', 'IP address of Tibbo device')
        .action((ipAddress) => {
        validateDeviceAddress(ipAddress);
        return new lib_1.TibboSettings()
            .getAll(ipAddress)
            .then((result) => console.log(JSON.stringify(result, null, 2)));
    });
    settings
        .command('get')
        .summary('Get the value for the setting on the device')
        .argument('<ipAddress>', 'IP address of Tibbo device')
        .argument('<settingID>', 'ID/name of the setting on the Tibbo device')
        .action((ipAddress, settingID) => {
        validateDeviceAddress(ipAddress);
        return new lib_1.TibboSettings()
            .get(ipAddress, settingID)
            .then((result) => console.log(JSON.stringify(result, null, 2)));
    });
    settings
        .command('set')
        .summary('Get the value for the setting on the device')
        .argument('<ipAddress>', 'IP address of Tibbo device')
        .argument('<settingID>', 'ID/name of the setting on the Tibbo device')
        .argument('<settingValue>', 'New value to set for the setting on the Tibbo device')
        .action((ipAddress, settingID, settingValue) => {
        validateDeviceAddress(ipAddress);
        return new lib_1.TibboSettings()
            .set(ipAddress, settingID, settingValue)
            .then((result) => console.log(JSON.stringify(result, null, 2)));
    });
    settings
        .command('initialize')
        .summary('Reset the device settings back to their defaults')
        .argument('<ipAddress>', 'IP address of Tibbo device')
        .action((ipAddress) => {
        validateDeviceAddress(ipAddress);
        return new lib_1.TibboSettings()
            .initialize(ipAddress)
            .then((result) => console.log(JSON.stringify(result, null, 2)));
    });
    const tables = commander_1.program
        .command('tables')
        .summary('Perform table actions like fetching and managing rows')
        .argument('<ipAddress>', 'IP address of Tibbo device');
    const rows = tables
        .command('rows')
        .summary('Perform row actions like fetch, delete, add')
        .argument('<ipAddress>', 'IP address of Tibbo device');
    tables
        .command('fetch')
        .description('Fetch tables from a Tibbo device')
        .argument('<ipAddress>', 'IP address of Tibbo device')
        .action((ipAddress) => {
        validateDeviceAddress(ipAddress);
        return new lib_1.TibboTables()
            .get(ipAddress)
            .then((result) => console.log(JSON.stringify(result, null, 2)));
    });
    rows
        .command('fetch')
        .description('Fetch table rows from a Tibbo device table')
        .argument('<tableName>', 'Name of the table')
        .argument('<ipAddress>', 'IP address of Tibbo device')
        .action((tableName, ipAddress) => {
        validateDeviceAddress(ipAddress);
        return new lib_1.TibboTables()
            .getRows(ipAddress, tableName)
            .catch((err) => commander_1.program.error(err))
            .then((result) => console.log(JSON.stringify(result, null, 2)));
    });
    rows
        .command('delete')
        .description('Remove a single row from the given table on the device')
        .argument('<tableName>', 'Name of the table')
        .argument('<rowID>', 'ID of the row to delete')
        .argument('<ipAddress>', 'IP address of Tibbo device')
        .action((tableName, rowID, ipAddress) => {
        validateDeviceAddress(ipAddress);
        return new lib_1.TibboTables()
            .deleteRow(rowID, ipAddress, tableName)
            .then((result) => console.log(JSON.stringify(result, null, 2)));
    });
    rows
        .command('add')
        .description('Add a single row from the given table on the device')
        .argument('<tableName>', 'Name of the table')
        .argument('<rowData>', 'Row data to add')
        .argument('<ipAddress>', 'IP address of Tibbo device')
        .action((tableName, rowData, ipAddress) => {
        validateDeviceAddress(ipAddress);
        return new lib_1.TibboTables()
            .addRow(rowData, ipAddress, tableName)
            .then((result) => console.log(JSON.stringify(result, null, 2)));
    });
    commander_1.program.parse();
}
