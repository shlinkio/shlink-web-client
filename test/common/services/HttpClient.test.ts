import { HttpClient } from '../../../src/common/services/HttpClient';

describe('HttpClient', () => {
  const fetch = jest.fn();
  const httpClient = new HttpClient(fetch);

  beforeEach(jest.clearAllMocks);

  describe('fetchJson', () => {
    it('throws json on success', async () => {
      const theError = { error: true, foo: 'bar' };
      fetch.mockResolvedValue({ json: () => theError, ok: false });

      await expect(httpClient.fetchJson('')).rejects.toEqual(theError);
    });

    it('return json on failure', async () => {
      const theJson = { foo: 'bar' };
      fetch.mockResolvedValue({ json: () => theJson, ok: true });

      const result = await httpClient.fetchJson('');

      expect(result).toEqual(theJson);
    });
  });

  describe('fetchEmpty', () => {
    it('returns empty on success', async () => {
      fetch.mockResolvedValue({ ok: true });

      const result = await httpClient.fetchEmpty('');

      expect(result).not.toBeDefined();
    });

    it('throws error on failure', async () => {
      const theError = { error: true, foo: 'bar' };
      fetch.mockResolvedValue({ json: () => theError, ok: false });

      await expect(httpClient.fetchJson('')).rejects.toEqual(theError);
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
