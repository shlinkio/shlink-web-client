import type { HttpClient } from '@shlinkio/shlink-js-sdk';
import { fromPartial } from '@total-typescript/shoehorn';
import { fetchServers } from '../../../src/servers/reducers/remoteServers';

describe('remoteServersReducer', () => {
  describe('fetchServers', () => {
    const dispatch = vi.fn();
    const jsonRequest = vi.fn();
    const httpClient = fromPartial<HttpClient>({ jsonRequest });

    it.each([
      [
        [
          {
            name: 'acel.me from servers.json',
            url: 'https://acel.me',
            apiKey: '07fb8a96-8059-4094-a24c-80a7d5e7e9b0',
          },
          {
            name: 'Local from servers.json',
            url: 'http://localhost:8000',
            apiKey: '7a531c75-134e-4d5c-86e0-a71b7167b57a',
          },
        ],
        {
          'acel.me-from-servers.json-acel.me': {
            id: 'acel.me-from-servers.json-acel.me',
            name: 'acel.me from servers.json',
            url: 'https://acel.me',
            apiKey: '07fb8a96-8059-4094-a24c-80a7d5e7e9b0',
          },
          'local-from-servers.json-localhost-8000': {
            id: 'local-from-servers.json-localhost-8000',
            name: 'Local from servers.json',
            url: 'http://localhost:8000',
            apiKey: '7a531c75-134e-4d5c-86e0-a71b7167b57a',
          },
        },
      ],
      [
        [
          {
            name: 'acel.me from servers.json',
            url: 'https://acel.me',
            apiKey: '07fb8a96-8059-4094-a24c-80a7d5e7e9b0',
          },
          {
            name: 'Invalid',
          },
          {
            name: 'Local from servers.json',
            url: 'http://localhost:8000',
            apiKey: '7a531c75-134e-4d5c-86e0-a71b7167b57a',
          },
        ],
        {
          'acel.me-from-servers.json-acel.me': {
            id: 'acel.me-from-servers.json-acel.me',
            name: 'acel.me from servers.json',
            url: 'https://acel.me',
            apiKey: '07fb8a96-8059-4094-a24c-80a7d5e7e9b0',
          },
          'local-from-servers.json-localhost-8000': {
            id: 'local-from-servers.json-localhost-8000',
            name: 'Local from servers.json',
            url: 'http://localhost:8000',
            apiKey: '7a531c75-134e-4d5c-86e0-a71b7167b57a',
          },
        },
      ],
      ['<html></html>', {}],
      [{}, {}],
    ])('tries to fetch servers from remote', async (mockedValue, expectedNewServers) => {
      jsonRequest.mockResolvedValue(mockedValue);
      const doFetchServers = fetchServers(httpClient);

      await doFetchServers()(dispatch, vi.fn(), {});

      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({ payload: expectedNewServers }));
      expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({ payload: undefined }));
      expect(jsonRequest).toHaveBeenCalledTimes(1);
    });
  });
});
