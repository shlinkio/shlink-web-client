import type { HttpClient } from '@shlinkio/shlink-js-sdk';
import { fromPartial } from '@total-typescript/shoehorn';
import { buildShlinkApiClient } from '../../../src/api/services/ShlinkApiClientBuilder';
import type { ReachableServer, SelectedServer } from '../../../src/servers/data';

describe('ShlinkApiClientBuilder', () => {
  const server = fromPartial<ReachableServer>;

  const createBuilder = () => {
    const builder = buildShlinkApiClient(fromPartial({}));
    return (selectedServer: SelectedServer) => builder(() => fromPartial({ selectedServer }));
  };

  it('creates new instances when provided params are different', async () => {
    const builder = createBuilder();
    const firstApiClient = builder(server({ url: 'foo', apiKey: 'bar' }));
    const secondApiClient = builder(server({ url: 'bar', apiKey: 'bar' }));
    const thirdApiClient = builder(server({ url: 'bar', apiKey: 'foo' }));

    expect(firstApiClient === secondApiClient).toEqual(false);
    expect(firstApiClient === thirdApiClient).toEqual(false);
    expect(secondApiClient === thirdApiClient).toEqual(false);
  });

  it('returns existing instances when provided params are the same', () => {
    const builder = createBuilder();
    const selectedServer = server({ url: 'foo', apiKey: 'bar' });

    const firstApiClient = builder(selectedServer);
    const secondApiClient = builder(selectedServer);
    const thirdApiClient = builder(selectedServer);

    expect(firstApiClient === secondApiClient).toEqual(true);
    expect(firstApiClient === thirdApiClient).toEqual(true);
    expect(secondApiClient === thirdApiClient).toEqual(true);
  });

  it.only('does not fetch from state when provided param is already selected server', async () => {
    const url = 'the_url';
    const apiKey = 'the_api_key';
    const jsonRequest = vi.fn();
    const httpClient = fromPartial<HttpClient>({ jsonRequest });
    const apiClient = buildShlinkApiClient(httpClient)(server({ url, apiKey }));

    await apiClient.health();

    expect(jsonRequest).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`^${url}`)), expect.objectContaining({
      headers: {
        'X-Api-Key': apiKey,
      },
    }));
  });
});
