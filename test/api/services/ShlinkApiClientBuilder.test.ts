import { Mock } from 'ts-mockery';
import { AxiosInstance } from 'axios';
import buildShlinkApiClient from '../../../src/api/services/ShlinkApiClientBuilder';
import { ReachableServer, SelectedServer } from '../../../src/servers/data';
import { ShlinkState } from '../../../src/container/types';

describe('ShlinkApiClientBuilder', () => {
  const axiosMock = Mock.all<AxiosInstance>();
  const server = (data: Partial<ReachableServer>) => Mock.of<ReachableServer>(data);

  const createBuilder = () => {
    const builder = buildShlinkApiClient(axiosMock);

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
    const apiClient = buildShlinkApiClient(axiosMock)(server({ url, apiKey }));

    expect(apiClient['baseUrl']).toEqual(url); // eslint-disable-line @typescript-eslint/dot-notation
    expect(apiClient['apiKey']).toEqual(apiKey); // eslint-disable-line @typescript-eslint/dot-notation
  });
});
