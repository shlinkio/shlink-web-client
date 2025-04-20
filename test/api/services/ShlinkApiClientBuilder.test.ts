import type { HttpClient } from '@shlinkio/shlink-js-sdk';
import { fromPartial } from '@total-typescript/shoehorn';
import { buildShlinkApiClient } from '../../../src/api/services/ShlinkApiClientBuilder';
import type { ReachableServer, SelectedServer } from '../../../src/servers/data';

describe('ShlinkApiClientBuilder', () => {
  const server = fromPartial<ReachableServer>;

  const createBuilder = (httpClient: HttpClient = fromPartial({})) => {
    const builder = buildShlinkApiClient(httpClient);
    return (selectedServer: SelectedServer) => builder(() => fromPartial({ selectedServer }));
  };

  it('creates new instances when provided params are different', async () => {
    const builder = createBuilder();
    const firstApiClient = builder(server({ url: 'foo', apiKey: 'bar' }));
    const secondApiClient = builder(server({ url: 'bar', apiKey: 'bar' }));
    const thirdApiClient = builder(server({ url: 'bar', apiKey: 'foo' }));

    expect(firstApiClient).not.toBe(secondApiClient);
    expect(firstApiClient).not.toBe(thirdApiClient);
    expect(secondApiClient).not.toBe(thirdApiClient);
  });

  it('returns existing instances when provided params are the same', () => {
    const builder = createBuilder();
    const selectedServer = server({ url: 'foo', apiKey: 'bar' });

    const firstApiClient = builder(selectedServer);
    const secondApiClient = builder(selectedServer);
    const thirdApiClient = builder(selectedServer);

    expect(firstApiClient).toBe(secondApiClient);
    expect(firstApiClient).toBe(thirdApiClient);
    expect(secondApiClient).toBe(thirdApiClient);
  });

  it('does not fetch from state when provided param is already a server', async () => {
    const url = 'the_url';
    const apiKey = 'the_api_key';
    const jsonRequest = vi.fn();
    const httpClient = fromPartial<HttpClient>({ jsonRequest });
    const apiClient = createBuilder(httpClient)(server({ url, apiKey }));

    await apiClient.health();

    expect(jsonRequest).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`^${url}`)), expect.objectContaining({
      credentials: undefined,
      headers: {
        'X-Api-Key': apiKey,
      },
    }));
  });

  it('includes credentials when forwarding is enabled', async () => {
    const url = 'the_url';
    const apiKey = 'the_api_key';
    const jsonRequest = vi.fn();
    const httpClient = fromPartial<HttpClient>({ jsonRequest });
    const apiClient = createBuilder(httpClient)(server({ url, apiKey, forwardCredentials: true }));

    await apiClient.health();

    expect(jsonRequest).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`^${url}`)), expect.objectContaining({
      credentials: 'include',
      headers: {
        'X-Api-Key': apiKey,
      },
    }));
  });
});
