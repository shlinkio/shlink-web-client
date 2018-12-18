import buildShlinkApiClient from '../../../src/utils/services/ShlinkApiClientBuilder';

describe('ShlinkApiClientBuilder', () => {
  const builder = buildShlinkApiClient({});

  it('creates new instances when provided params are different', () => {
    const firstApiClient = builder({ url: 'foo', apiKey: 'bar' });
    const secondApiClient = builder({ url: 'bar', apiKey: 'bar' });
    const thirdApiClient = builder({ url: 'bar', apiKey: 'foo' });

    expect(firstApiClient).not.toBe(secondApiClient);
    expect(firstApiClient).not.toBe(thirdApiClient);
    expect(secondApiClient).not.toBe(thirdApiClient);
  });

  it('returns existing instances when provided params are the same', () => {
    const params = { url: 'foo', apiKey: 'bar' };
    const firstApiClient = builder(params);
    const secondApiClient = builder(params);
    const thirdApiClient = builder(params);

    expect(firstApiClient).toBe(secondApiClient);
    expect(firstApiClient).toBe(thirdApiClient);
    expect(secondApiClient).toBe(thirdApiClient);
  });
});
