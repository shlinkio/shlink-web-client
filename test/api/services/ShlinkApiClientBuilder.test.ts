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

  it('does not fetch from state when provided param is already selected server', () => {
    const url = 'url';
    const apiKey = 'apiKey';
    const apiClient = buildShlinkApiClient(fromPartial({}))(server({ url, apiKey }));

    expect(apiClient['serverInfo'].baseUrl).toEqual(url); // eslint-disable-line @typescript-eslint/dot-notation
    expect(apiClient['serverInfo'].apiKey).toEqual(apiKey); // eslint-disable-line @typescript-eslint/dot-notation
  });
});
