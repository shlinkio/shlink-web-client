import { fromPartial } from '@total-typescript/shoehorn';
import type { HttpClient } from '../../../src/common/services/HttpClient';
import { fetchServers } from '../../../src/servers/reducers/remoteServers';

describe('remoteServersReducer', () => {
  afterEach(vi.clearAllMocks);

  describe('fetchServers', () => {
    const dispatch = vi.fn();
    const fetchJson = vi.fn();
    const httpClient = fromPartial<HttpClient>({ fetchJson });

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

      await doFetchServers()(dispatch, vi.fn(), {});

      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({ payload: expectedNewServers }));
      expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({ payload: undefined }));
      expect(fetchJson).toHaveBeenCalledTimes(1);
    });
  });
});
