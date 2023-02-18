import { Mock } from 'ts-mockery';
import { fetchServers } from '../../../src/servers/reducers/remoteServers';
import { createServers } from '../../../src/servers/reducers/servers';
import type { HttpClient } from '../../../src/common/services/HttpClient';

describe('remoteServersReducer', () => {
  afterEach(jest.clearAllMocks);

  describe('fetchServers', () => {
    const dispatch = jest.fn();
    const fetchJson = jest.fn();
    const httpClient = Mock.of<HttpClient>({ fetchJson });

    it.each([
      [
        [
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
        [
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
      fetchJson.mockResolvedValue(mockedValue);
      const doFetchServers = fetchServers(httpClient);

      await doFetchServers()(dispatch, jest.fn(), {});

      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: doFetchServers.pending.toString(),
      }));
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: createServers.toString(), payload: expectedNewServers });
      expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
        type: doFetchServers.fulfilled.toString(),
      }));
      expect(fetchJson).toHaveBeenCalledTimes(1);
    });
  });
});
