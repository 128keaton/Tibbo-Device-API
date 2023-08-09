import {TibboFunctions} from '../../lib';
import fetchMock from "jest-fetch-mock";
require('jest-fetch-mock').enableMocks()


let timeoutSpy: any;
afterEach(() => {
    jest.restoreAllMocks();

    if (!!timeoutSpy) {
        clearTimeout(timeoutSpy);
        timeoutSpy.unref();
    }
})

beforeEach(() => {
    fetchMock.resetMocks();
})


describe('TibboFunctions', () => {
    test('reboot device', async () => {
        const functions = new TibboFunctions();

        fetchMock.mockResponseOnce('');
        const response = functions.reboot('0.0.0.0');

        await expect(response).resolves.toEqual(true);
    });


    test('send device command', async () => {
        const functions = new TibboFunctions();
        fetchMock.mockResponseOnce('');
        const response = functions.runCommand('3.3.3.3', 'TEST_CMD');

        await expect(response).resolves.toEqual(true);
    });

    test('send bad device command', async () => {
        const functions = new TibboFunctions();
        fetchMock.mockRejectOnce(new Error('request-timeout'))
        const response = functions.runCommand('3.5.3.3', 'TEST_CMD');

        await expect(response).rejects.toBeInstanceOf(Error)
    });
});
