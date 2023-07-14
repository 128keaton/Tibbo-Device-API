#! /usr/bin/env node
import { program } from 'commander';
import { TibboTables } from './lib';

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

      return new TibboTables()
        .addRow(rowData, ipAddress, tableName)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  program.parse();
}
