import { Mock } from 'ts-mockery';
import { AxiosInstance } from 'axios';
import { fetchServers } from '../../../src/servers/reducers/remoteServers';
import { CREATE_SERVERS } from '../../../src/servers/reducers/servers';

describe('remoteServersReducer', () => {
  afterEach(jest.resetAllMocks);

  describe('fetchServers', () => {
    const get = jest.fn();
    const axios = Mock.of<AxiosInstance>({ get });
    const dispatch = jest.fn();

    it.each([
      [
        Promise.resolve({
          data: [
            {
              id: '111',
              name: 'acel.me from servers.json',
              url: 'https://acel.me',
              apiKey: '07fb8a96-8059-4094-a24c-80a7d5e7e9b0',
            },
            {
              id: '222',
              name: 'Local from servers.json',
              url: 'http://localhost:8000',
              apiKey: '7a531c75-134e-4d5c-86e0-a71b7167b57a',
            },
          ],
        }),
        {
          111: {
            id: '111',
            name: 'acel.me from servers.json',
            url: 'https://acel.me',
            apiKey: '07fb8a96-8059-4094-a24c-80a7d5e7e9b0',
          },
          222: {
            id: '222',
            name: 'Local from servers.json',
            url: 'http://localhost:8000',
            apiKey: '7a531c75-134e-4d5c-86e0-a71b7167b57a',
          },
        },
      ],
      [ Promise.resolve('<html></html>'), {}],
      [ Promise.reject({}), {}],
    ])('tries to fetch servers from remote', async (mockedValue, expectedList) => {
      get.mockReturnValue(mockedValue);

      await fetchServers(axios)()(dispatch);

      expect(dispatch).toHaveBeenCalledWith({ type: CREATE_SERVERS, newServers: expectedList });
      expect(get).toHaveBeenCalledTimes(1);
    });
  });
});
