import { TibboRow, TibboTable, TibboTables } from '../lib';

jest.mock('node-fetch');
import fetch from 'node-fetch';
import { mockedTableResponse, rawTableOne } from './test-consts';

const { Response } = jest.requireActual('node-fetch');

describe('TibboTables', () => {
  test('get tables', async () => {
    const tibboTables = new TibboTables();

    const tableOne = new TibboTable(rawTableOne);

    (fetch as jest.MockedFunction<typeof fetch>).mockImplementation((url) => {
      if (
        url === 'http://0.0.0.0/api.html?e=t&p=&a=rows&table=CREDS' ||
        url === 'http://0.0.0.0/api.html?e=t&p=&a=rows&table=TBL2'
      )
        return Promise.resolve(new Response('0'));

      return Promise.resolve(new Response(mockedTableResponse));
    });

    const response = await tibboTables.get('0.0.0.0');

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(response.length).toEqual(2);
    expect(response[0]).toEqual(tableOne);
  });

  test('get table rows', async () => {
    const tibboTables = new TibboTables();

    (fetch as jest.MockedFunction<typeof fetch>).mockImplementation((url) => {
      if (url === 'http://0.0.0.0/api.html?e=t&p=&a=rows&table=CREDS') {
        return Promise.resolve(new Response('2\r\n1,1,12-2451\r\n2,2,12-2455'));
      }

      return Promise.resolve(new Response(mockedTableResponse));
    });

    const response = await tibboTables.getRows('0.0.0.0', 'CREDS');

    expect(response.length).toEqual(2);
    expect(response[0]).toEqual(new TibboRow('1,1,12-2451', ['ID', 'RAW']));
  });

  test('get invalid table rows', async () => {
    const tibboTables = new TibboTables();

    (fetch as jest.MockedFunction<typeof fetch>).mockImplementation((url) =>
      Promise.resolve(new Response(mockedTableResponse)),
    );

    await expect(tibboTables.getRows('0.0.0.0', 'BAD-TABLE')).rejects.toThrow(
      Error,
    );
  });

  test('add table row', async () => {
    const tibboTables = new TibboTables();

    (fetch as jest.MockedFunction<typeof fetch>).mockImplementation(
      (url, init) => {
        if (
          !!init &&
          init.method === 'POST' &&
          url === 'http://0.0.0.0/api.html'
        ) {
          return Promise.resolve(new Response(''));
        }

        return Promise.resolve(new Response(mockedTableResponse));
      },
    );

    const addedRow = await tibboTables.addRow('1,12-2451', '0.0.0.0', 'CREDS');

    expect(addedRow).toEqual(true);
  });

  test('delete table row', async () => {
    const tibboTables = new TibboTables();

    (fetch as jest.MockedFunction<typeof fetch>).mockImplementation(
      (url, init) => {
        if (
          !!init &&
          init.method === 'POST' &&
          url === 'http://0.0.0.0/api.html'
        ) {
          return Promise.resolve(new Response(''));
        }

        return Promise.resolve(new Response(mockedTableResponse));
      },
    );

    const deletedRow = await tibboTables.deleteRow(0, '0.0.0.0', 'CREDS');

    expect(deletedRow).toEqual(true);
  });
});
