#! /usr/bin/env node
import { program } from 'commander';
import { TibboQuery, TibboTables, TibboSettings, TibboFunctions } from './lib';

if (require.main == module) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageInfo = require('../package.json');
  const validateDeviceAddress = (deviceAddress: string) => {
    if (!deviceAddress.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/))
      program.error(`error: invalid IP address: '${deviceAddress}'`);

    return true;
  };

  const tibboFunctions = new TibboFunctions();
  const tibboQuery = new TibboQuery();
  const tibboSettings = new TibboSettings();
  const tibboTables = new TibboTables();

  program
    .name('tibbo-device-api')
    .version(packageInfo.version)
    .argument('<ipAddress>', 'IP address of Tibbo device');

  program
    .command('reboot')
    .summary('Reboot Tibbo device')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((ipAddress, devicePassword) => {
      validateDeviceAddress(ipAddress);
      return tibboFunctions
        .reboot(ipAddress, devicePassword)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  program
    .command('login')
    .summary('Login to a Tibbo device')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((ipAddress, devicePassword) => {
      validateDeviceAddress(ipAddress);
      return tibboFunctions
        .login(ipAddress, devicePassword)
        .then((result) => console.log(result));
    });

  program
    .command('query')
    .summary('Query device info')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((ipAddress, devicePassword) => {
      validateDeviceAddress(ipAddress);
      return tibboQuery
        .query(ipAddress, devicePassword)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  const settings = program
    .command('settings')
    .summary('Update and view settings on the device');

  settings
    .command('all')
    .summary('Get all the current settings on the device')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((ipAddress, devicePassword) => {
      validateDeviceAddress(ipAddress);
      return tibboSettings
        .getAll(ipAddress, devicePassword)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  settings
    .command('get')
    .summary('Get the value for the setting on the device')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<settingID>', 'ID/name of the setting on the Tibbo device')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((ipAddress, settingID, devicePassword) => {
      validateDeviceAddress(ipAddress);
      return tibboSettings
        .get(ipAddress, settingID, devicePassword)
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
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((ipAddress, settingID, settingValue, devicePassword) => {
      validateDeviceAddress(ipAddress);
      return tibboSettings
        .set(ipAddress, settingID, settingValue, devicePassword)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  settings
    .command('export')
    .summary('Export the settings on the device')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((ipAddress, devicePassword) => {
      validateDeviceAddress(ipAddress);
      return tibboSettings
        .export(ipAddress, devicePassword)
        .then((result) => console.log(JSON.stringify(JSON.stringify(result))));
    });

  settings
    .command('import')
    .summary('Import raw settings to the device')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<rawSettings>', 'Raw JSON settings string')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((ipAddress, rawSettings, devicePassword) => {
      validateDeviceAddress(ipAddress);
      return tibboSettings
        .import(ipAddress, rawSettings, devicePassword)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  settings
    .command('initialize')
    .summary('Reset the device settings back to their defaults')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((ipAddress, devicePassword) => {
      validateDeviceAddress(ipAddress);
      return tibboSettings
        .initialize(ipAddress, devicePassword)
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
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((ipAddress, devicePassword) => {
      validateDeviceAddress(ipAddress);
      return tibboTables
        .get(ipAddress, devicePassword)
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  rows
    .command('fetch')
    .description('Fetch table rows from a Tibbo device table')
    .argument('<tableName>', 'Name of the table')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((tableName, ipAddress, devicePassword) => {
      validateDeviceAddress(ipAddress);

      return tibboTables
        .getRows(ipAddress, tableName, devicePassword)
        .catch((err) => program.error(err))
        .then((result) => console.log(JSON.stringify(result, null, 2)));
    });

  rows
    .command('delete')
    .description('Remove a single row from the given table on the device')
    .argument('<tableName>', 'Name of the table')
    .argument('<rowID>', 'ID of the row to delete')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((tableName, rowID, ipAddress, devicePassword) => {
      validateDeviceAddress(ipAddress);

      return tibboTables
        .deleteRow(rowID, ipAddress, tableName, devicePassword)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  rows
    .command('add')
    .description('Add a single row from the given table on the device')
    .argument('<tableName>', 'Name of the table')
    .argument('<rowData>', 'Row data to add')
    .argument('<ipAddress>', 'IP address of Tibbo device')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .action((tableName, rowData, ipAddress, devicePassword) => {
      validateDeviceAddress(ipAddress);

      return tibboTables
        .addRow(rowData, ipAddress, tableName, devicePassword)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  const command = program
    .command('command')
    .summary('Run external commands on the device');

  command
    .command('run')
    .description('Run a command on the device with optional value')
    .argument('<ipAddress>', 'IP address of the Tibbo device')
    .argument('<command>', 'Name of the command')
    .argument('<devicePassword>', 'Password of Tibbo device')
    .option('-v --value', 'Optional value to send')
    .action((ipAddress, command, devicePassword, value) => {
      validateDeviceAddress(ipAddress);

      return tibboFunctions
        .runCommand(ipAddress, command, value, devicePassword)
        .then((result) => console.log(result ? 'Success' : 'Error'));
    });

  program.parse();
}
