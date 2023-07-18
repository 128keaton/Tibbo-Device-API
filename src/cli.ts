#! /usr/bin/env node
import { program } from 'commander';
import { TibboQuery, TibboTables, TibboSettings } from './lib';

if (require.main == module) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageInfo = require('../package.json');

  const validateDeviceAddress = (deviceAddress: string) => {
    if (!deviceAddress.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/))
      program.error(`error: invalid IP address: '${deviceAddress}'`);

    return true;
  };

  program
    .name('tibbo-device-api')
    .version(packageInfo.version)
    .argument('<ipAddress>', 'IP address of Tibbo device');

  program
    .command('query')
    .summary('Query device info')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .action((ipAddress) => {
      validateDeviceAddress(ipAddress);
      return new TibboQuery()
        .query(ipAddress)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  const settings = program
    .command('settings')
    .summary('Update and view settings on the device');

  settings
    .command('all')
    .summary('Get all the current settings on the device')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .action((ipAddress) => {
      validateDeviceAddress(ipAddress);
      return new TibboSettings()
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
      return new TibboSettings()
        .get(ipAddress, settingID)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  settings
    .command('set')
    .summary('Get the value for the setting on the device')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<settingID>', 'ID/name of the setting on the Tibbo device')
    .argument(
      '<settingValue>',
      'New value to set for the setting on the Tibbo device',
    )
    .action((ipAddress, settingID, settingValue) => {
      validateDeviceAddress(ipAddress);
      return new TibboSettings()
        .set(ipAddress, settingID, settingValue)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  settings
    .command('initialize')
    .summary('Reset the device settings back to their defaults')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .action((ipAddress) => {
      validateDeviceAddress(ipAddress);
      return new TibboSettings()
        .initialize(ipAddress)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  const tables = program
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
      return new TibboTables()
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

      return new TibboTables()
        .getRows(ipAddress, tableName)
        .catch((err) => program.error(err))
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

      return new TibboTables()
        .deleteRow(rowID, ipAddress, tableName)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  rows
    .command('add')
    .description('Add a single row from the given table on the device')
    .argument('<tableName>', 'Name of the table')
    .argument('<rowData>', 'Row data to add')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .action((tableName, rowData, ipAddress) => {
      validateDeviceAddress(ipAddress);

      return new TibboTables()
        .addRow(rowData, ipAddress, tableName)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  program.parse();
}
