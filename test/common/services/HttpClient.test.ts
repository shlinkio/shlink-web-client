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

    it.each([
      [undefined],
      [{}],
      [{ body: undefined }],
      [{ body: '' }],
    ])('return json on failure', async (options) => {
      const theJson = { foo: 'bar' };
      fetch.mockResolvedValue({ json: () => theJson, ok: true });

      const result = await httpClient.fetchJson('the_url', options);

      expect(result).toEqual(theJson);
      expect(fetch).toHaveBeenCalledWith('the_url', options);
    });

    it.each([
      [{ body: 'the_body' }],
      [{
        body: 'the_body',
        headers: {
          'Content-Type': 'text/plain',
        },
      }],
    ])('forwards JSON content-type when appropriate', async (options) => {
      const theJson = { foo: 'bar' };
      fetch.mockResolvedValue({ json: () => theJson, ok: true });

      const result = await httpClient.fetchJson('the_url', options);

      expect(result).toEqual(theJson);
      expect(fetch).toHaveBeenCalledWith('the_url', expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }));
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
