import { HttpClient } from '../../../src/common/services/HttpClient';

describe('HttpClient', () => {
  const fetch = jest.fn();
  const httpClient = new HttpClient(fetch);

  beforeEach(jest.clearAllMocks);

  describe('fetchJson', () => {
    it('throws json when response is not ok', async () => {
      const theError = { error: true, foo: 'bar' };
      fetch.mockResolvedValue({ json: () => theError, ok: false });

      await expect(httpClient.fetchJson('')).rejects.toEqual(theError);
    });

    it('return json when response is ok', async () => {
      const theJson = { foo: 'bar' };
      fetch.mockResolvedValue({ json: () => theJson, ok: true });

      const result = await httpClient.fetchJson('');

      expect(result).toEqual(theJson);
    });
  });

  describe('fetchBlob', () => {
    it('returns response as blob', async () => {
      const theBlob = new Blob();
      fetch.mockResolvedValue({ blob: () => theBlob });

      const result = await httpClient.fetchBlob('');

      expect(result).toEqual(theBlob);
    });
  });
});
