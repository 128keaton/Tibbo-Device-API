import {TibboFunctions, TibboQuery} from '../../lib';
import fetch, {FetchError} from 'node-fetch';

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');

let timeoutSpy: any;
afterEach(() => {
    jest.restoreAllMocks();

    if (!!timeoutSpy) {
        clearTimeout(timeoutSpy);
        timeoutSpy.unref();
    }
})

const mockFetch = () => {
    return (fetch as jest.MockedFunction<typeof fetch>).mockImplementation(
        (url) => {
               if (`${url}`.includes('0.0.0.0')) {
                   return new Promise(resolve => {
                       timeoutSpy = setTimeout(() => resolve(new Response('C')), 1800)
                   })
               } else if (`${url}`.includes('1.1.1.1')) {
                   return new Promise(resolve => {
                       timeoutSpy = setTimeout(() =>   resolve(new Response('\u0002C\r')), 100);
                   })
               } else {
                   return new Promise((resolve, reject) => {
                       reject(FetchError);
                   })
               }
        },
    );
};

describe('TibboFunctions', () => {
    test('reboot device', async () => {
        const functions = new TibboFunctions();

        mockFetch();

        const response = functions.reboot('0.0.0.0');

        await expect(response).resolves.toEqual(true);
    });

    test('invalid reboot device', async () => {
        const functions = new TibboFunctions();

        mockFetch();

        const response = await functions.reboot('1.1.1.1');

        expect(response).toEqual(false);
    });

    test('invalid reboot device 2', async () => {
        const functions = new TibboFunctions();

        mockFetch();

        const response = await functions.reboot('1.2.2.1');

        expect(response).toEqual(false);
    });



});
