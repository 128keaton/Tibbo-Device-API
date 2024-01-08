#! /usr/bin/env node
import { program } from 'commander';
import { TibboQuery, TibboTables, TibboSettings, TibboFunctions } from './lib';

if (require.main == module) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageInfo = require('../package.json');

  const tibboFunctions = new TibboFunctions();
  const tibboQuery = new TibboQuery();
  const tibboSettings = new TibboSettings();
  const tibboTables = new TibboTables();

  program
    .name('tibbo-device-api')
    .version(packageInfo.version)
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4');

  program
    .command('reboot')
    .summary('Reboot Tibbo device')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((deviceAddress, devicePassword) => {
      return tibboFunctions
        .reboot(deviceAddress, devicePassword)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  program
    .command('login')
    .summary('Login to a Tibbo device')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((deviceAddress, devicePassword) => {
      return tibboFunctions
        .login(deviceAddress, devicePassword)
        .then((result) => console.log(result));
    });

  program
    .command('query')
    .summary('Query device info')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((deviceAddress, devicePassword) => {
      return tibboQuery
        .query(deviceAddress, devicePassword)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  const settings = program
    .command('settings')
    .summary('Update and view settings on the device');

  settings
    .command('all')
    .summary('Get all the current settings on the device')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((deviceAddress, devicePassword) => {
      return tibboSettings
        .getAll(deviceAddress, devicePassword)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  settings
    .command('get')
    .summary('Get the value for the setting on the device')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<settingID>', 'ID/name of the setting on the Tibbo device')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((deviceAddress, settingID, devicePassword) => {
      return tibboSettings
        .get(deviceAddress, settingID, devicePassword)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  settings
    .command('set')
    .summary('Get the value for the setting on the device')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<settingID>', 'ID/name of the setting on the Tibbo device')
    .argument(
      '<settingValue>',
      'New value to set for the setting on the Tibbo device',
    )
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((deviceAddress, settingID, settingValue, devicePassword) => {
      return tibboSettings
        .set(deviceAddress, settingID, settingValue, devicePassword)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  settings
    .command('export')
    .summary('Export the settings on the device')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((deviceAddress, devicePassword) => {
      return tibboSettings
        .export(deviceAddress, devicePassword)
        .then((result) => console.log(JSON.stringify(JSON.stringify(result))));
    });

  settings
    .command('import')
    .summary('Import raw settings to the device')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<rawSettings>', 'Raw JSON settings string')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((deviceAddress, rawSettings, devicePassword) => {
      return tibboSettings
        .import(deviceAddress, rawSettings, devicePassword)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  settings
    .command('initialize')
    .summary('Reset the device settings back to their defaults')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((deviceAddress, devicePassword) => {
      return tibboSettings
        .initialize(deviceAddress, devicePassword)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  const tables = program
    .command('tables')
    .summary('Perform table actions like fetching and managing rows')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4');

  const rows = tables
    .command('rows')
    .summary('Perform row actions like fetch, delete, add')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4');

  tables
    .command('fetch')
    .description('Fetch tables from a Tibbo device')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((deviceAddress, devicePassword) => {
      return tibboTables
        .get(deviceAddress, devicePassword)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  rows
    .command('fetch')
    .description('Fetch table rows from a Tibbo device table')
    .argument('<tableName>', 'Name of the table')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((tableName, deviceAddress, devicePassword) => {
      return tibboTables
        .getRows(deviceAddress, tableName, devicePassword)
        .catch((err) => program.error(err))
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  rows
    .command('delete')
    .description('Remove a single row from the given table on the device')
    .argument('<tableName>', 'Name of the table')
    .argument('<rowID>', 'ID of the row to delete')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((tableName, rowID, deviceAddress, devicePassword) => {
      return tibboTables
        .deleteRow(rowID, deviceAddress, tableName, devicePassword)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  rows
    .command('add')
    .description('Add a single row from the given table on the device')
    .argument('<tableName>', 'Name of the table')
    .argument('<rowData>', 'Row data to add')
    .argument('<deviceAddress>', 'URL of the Tibbo, i.e. http://192.168.1.4')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((tableName, rowData, deviceAddress, devicePassword) => {
      return tibboTables
        .addRow(rowData, deviceAddress, tableName, devicePassword)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  const command = program
    .command('command')
    .summary('Run external commands on the device');

  command
    .command('run')
    .description('Run a command on the device with optional value')
    .argument('<deviceAddress>', 'IP address of the Tibbo device')
    .argument('<command>', 'Name of the command')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .option('-v --value', 'Optional value to send')
    .action((deviceAddress, command, devicePassword, value) => {
      return tibboFunctions
        .runCommand(deviceAddress, command, value, devicePassword)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  program.parse();
}
