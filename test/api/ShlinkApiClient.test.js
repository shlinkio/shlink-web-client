import { ShlinkApiClient } from '../../src/api/ShlinkApiClient'

describe('ShlinkApiClient', () => {
  const createApiClient = extraData => {
    const axiosMock = () =>
      Promise.resolve({
        data: { token: 'foo', ...extraData },
        headers: { authorization: 'Bearer abc123' }
      });

    return new ShlinkApiClient(axiosMock);
  };

  describe('listShortUrls', () => {
    it('properly returns short URLs list', async () => {
      const expectedList = ['foo', 'bar'];

      const apiClient = createApiClient({
        shortUrls: expectedList
      });

      const actualList = await apiClient.listShortUrls();
      expect(expectedList).toEqual(actualList);
    });
  });
});
