import buildShlinkApiClient from '../../../src/utils/services/ShlinkApiClientBuilder';
import { buildShlinkBaseUrl } from '../../../src/utils/services/ShlinkApiClient';

describe('ShlinkApiClientBuilder', () => {
  const createBuilder = () => {
    const builder = buildShlinkApiClient({});

    return (selectedServer) => builder(() => ({ selectedServer }));
  };

  it('creates new instances when provided params are different', async () => {
    const builder = createBuilder();
    const [ firstApiClient, secondApiClient, thirdApiClient ] = await Promise.all([
      builder({ url: 'foo', apiKey: 'bar' }),
      builder({ url: 'bar', apiKey: 'bar' }),
      builder({ url: 'bar', apiKey: 'foo' }),
    ]);

    expect(firstApiClient).not.toBe(secondApiClient);
    expect(firstApiClient).not.toBe(thirdApiClient);
    expect(secondApiClient).not.toBe(thirdApiClient);
  });

  it('returns existing instances when provided params are the same', async () => {
    const builder = createBuilder();
    const selectedServer = { url: 'foo', apiKey: 'bar' };
    const [ firstApiClient, secondApiClient, thirdApiClient ] = await Promise.all([
      builder(selectedServer),
      builder(selectedServer),
      builder(selectedServer),
    ]);

    expect(firstApiClient).toBe(secondApiClient);
    expect(firstApiClient).toBe(thirdApiClient);
    expect(secondApiClient).toBe(thirdApiClient);
  });

  it('does not fetch from state when provided param is already selected server', async () => {
    const url = 'url';
    const apiKey = 'apiKey';
    const apiClient = await buildShlinkApiClient({})({ url, apiKey });

    expect(apiClient._baseUrl).toEqual(buildShlinkBaseUrl(url));
    expect(apiClient._apiKey).toEqual(apiKey);
  });
});
