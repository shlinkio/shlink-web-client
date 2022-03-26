import { Mock } from 'ts-mockery';
import { AxiosInstance } from 'axios';
import { fetchServers } from '../../../src/servers/reducers/remoteServers';
import { CREATE_SERVERS } from '../../../src/servers/reducers/servers';

describe('remoteServersReducer', () => {
  afterEach(jest.clearAllMocks);

  describe('fetchServers', () => {
    const get = jest.fn();
    const axios = Mock.of<AxiosInstance>({ get });
    const dispatch = jest.fn();

    it.each([
      [
        {
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
        },
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
      [
        {
          data: [
            {
              id: '111',
              name: 'acel.me from servers.json',
              url: 'https://acel.me',
              apiKey: '07fb8a96-8059-4094-a24c-80a7d5e7e9b0',
            },
            {
              id: '222',
              name: 'Invalid',
            },
            {
              id: '333',
              name: 'Local from servers.json',
              url: 'http://localhost:8000',
              apiKey: '7a531c75-134e-4d5c-86e0-a71b7167b57a',
            },
          ],
        },
        {
          111: {
            id: '111',
            name: 'acel.me from servers.json',
            url: 'https://acel.me',
            apiKey: '07fb8a96-8059-4094-a24c-80a7d5e7e9b0',
          },
          333: {
            id: '333',
            name: 'Local from servers.json',
            url: 'http://localhost:8000',
            apiKey: '7a531c75-134e-4d5c-86e0-a71b7167b57a',
          },
        },
      ],
      ['<html></html>', {}],
      [{}, {}],
    ])('tries to fetch servers from remote', async (mockedValue, expectedNewServers) => {
      get.mockResolvedValue(mockedValue);

      await fetchServers(axios)()(dispatch);

      expect(dispatch).toHaveBeenCalledWith({ type: CREATE_SERVERS, newServers: expectedNewServers });
      expect(get).toHaveBeenCalledTimes(1);
    });
  });
});
