import { Mock } from 'ts-mockery';
import { buildShlinkApiClient } from '../../../src/api/services/ShlinkApiClientBuilder';
import type { ReachableServer, SelectedServer } from '../../../src/servers/data';
import type { ShlinkState } from '../../../src/container/types';
import type { HttpClient } from '../../../src/common/services/HttpClient';

describe('ShlinkApiClientBuilder', () => {
  const server = (data: Partial<ReachableServer>) => Mock.of<ReachableServer>(data);

  const createBuilder = () => {
    const builder = buildShlinkApiClient(Mock.of<HttpClient>());
    return (selectedServer: SelectedServer) => builder(() => Mock.of<ShlinkState>({ selectedServer }));
  };

  it('creates new instances when provided params are different', async () => {
    const builder = createBuilder();
    const [firstApiClient, secondApiClient, thirdApiClient] = await Promise.all([
      builder(server({ url: 'foo', apiKey: 'bar' })),
      builder(server({ url: 'bar', apiKey: 'bar' })),
      builder(server({ url: 'bar', apiKey: 'foo' })),
    ]);

    expect(firstApiClient).not.toBe(secondApiClient);
    expect(firstApiClient).not.toBe(thirdApiClient);
    expect(secondApiClient).not.toBe(thirdApiClient);
  });

  it('returns existing instances when provided params are the same', async () => {
    const builder = createBuilder();
    const selectedServer = server({ url: 'foo', apiKey: 'bar' });
    const [firstApiClient, secondApiClient, thirdApiClient] = await Promise.all([
      builder(selectedServer),
      builder(selectedServer),
      builder(selectedServer),
    ]);

    expect(firstApiClient).toBe(secondApiClient);
    expect(firstApiClient).toBe(thirdApiClient);
    expect(secondApiClient).toBe(thirdApiClient);
  });

  it('does not fetch from state when provided param is already selected server', () => {
    const url = 'url';
    const apiKey = 'apiKey';
    const apiClient = buildShlinkApiClient(Mock.of<HttpClient>())(server({ url, apiKey }));

    expect(apiClient['baseUrl']).toEqual(url); // eslint-disable-line @typescript-eslint/dot-notation
    expect(apiClient['apiKey']).toEqual(apiKey); // eslint-disable-line @typescript-eslint/dot-notation
  });
});
