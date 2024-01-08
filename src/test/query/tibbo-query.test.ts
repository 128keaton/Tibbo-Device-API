import {TibboQuery} from '../../lib';
import fetch from 'node-fetch';

jest.mock('node-fetch');

const { Response } = jest.requireActual('node-fetch');

const mockFetch = () => {
    return (fetch as jest.MockedFunction<typeof fetch>).mockImplementation(
        (url, init) => {
            if (url === 'http://0.0.0.0/api.html?e=i&action=get')
                return Promise.resolve(
                    new Response(
                        `{"firmwareVersion":"TPP3W(G2)-4.00.01","ip":"192.168.1.8","mac":"0.36.119.87.122.196","wlnmac":"0.0.0.0.0.0","wlnip":"1.0.0.1","uptime":"11699","wifiOn":"0","timezone":"0","time":"1689701484"}`,
                    ),
                );

            return Promise.resolve(new Response());
        },
    );
};

describe('TibboQuery', () => {
    test('query device', async () => {
        mockFetch();
        const tibboQuery = new TibboQuery();
        const response = await tibboQuery.query('0.0.0.0');

        expect(response.wifiOn).toEqual(false);
        expect(response.firmwareVersion).toEqual('TPP3W(G2)-4.00.01');
        expect(response.time).toEqual(1689701484);
        expect(response.network.eth.ipAddress).toEqual('192.168.1.8');
        expect(response.network.eth.macAddress).toEqual('0.36.119.87.122.196');
    });


});
