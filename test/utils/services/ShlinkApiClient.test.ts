import { AxiosInstance, AxiosRequestConfig } from 'axios';
import ShlinkApiClient from '../../../src/utils/services/ShlinkApiClient';
import { OptionalString } from '../../../src/utils/utils';

describe('ShlinkApiClient', () => {
  const createAxios = (data: AxiosRequestConfig) => (async () => Promise.resolve(data)) as unknown as AxiosInstance;
  const createAxiosMock = (data: AxiosRequestConfig = {}) => jest.fn(createAxios(data)) as unknown as AxiosInstance;
  const createApiClient = (data: AxiosRequestConfig) => new ShlinkApiClient(createAxios(data), '', '');
  const shortCodesWithDomainCombinations: [ string, OptionalString ][] = [
    [ 'abc123', null ],
    [ 'abc123', undefined ],
    [ 'abc123', 'example.com' ],
  ];

  describe('listShortUrls', () => {
    it('properly returns short URLs list', async () => {
      const expectedList = [ 'foo', 'bar' ];

      const { listShortUrls } = createApiClient({
        data: {
          shortUrls: expectedList,
        },
      });

      const actualList = await listShortUrls();

      expect(expectedList).toEqual(actualList);
    });
  });

  describe('createShortUrl', () => {
    const shortUrl = {
      bar: 'foo',
    };

    it('returns create short URL', async () => {
      const { createShortUrl } = createApiClient({ data: shortUrl });
      const result = await createShortUrl({});

      expect(result).toEqual(shortUrl);
    });

    it('removes all empty options', async () => {
      const axiosSpy = createAxiosMock({ data: shortUrl });
      const { createShortUrl } = new ShlinkApiClient(axiosSpy, '', '');

      await createShortUrl(
        { foo: 'bar', empty: undefined, anotherEmpty: null },
      );

      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({ data: { foo: 'bar' } }));
    });
  });

  describe('getShortUrlVisits', () => {
    it('properly returns short URL visits', async () => {
      const expectedVisits = [ 'foo', 'bar' ];
      const axiosSpy = createAxiosMock({
        data: {
          visits: {
            data: expectedVisits,
          },
        },
      });
      const { getShortUrlVisits } = new ShlinkApiClient(axiosSpy, '', '');

      const actualVisits = await getShortUrlVisits('abc123', {});

      expect({ data: expectedVisits }).toEqual(actualVisits);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: '/short-urls/abc123/visits',
        method: 'GET',
      }));
    });
  });

  describe('getTagVisits', () => {
    it('properly returns tag visits', async () => {
      const expectedVisits = [ 'foo', 'bar' ];
      const axiosSpy = createAxiosMock({
        data: {
          visits: {
            data: expectedVisits,
          },
        },
      });
      const { getTagVisits } = new ShlinkApiClient(axiosSpy, '', '');

      const actualVisits = await getTagVisits('foo', {});

      expect({ data: expectedVisits }).toEqual(actualVisits);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: '/tags/foo/visits',
        method: 'GET',
      }));
    });
  });

  describe('getShortUrl', () => {
    it.each(shortCodesWithDomainCombinations)('properly returns short URL', async (shortCode, domain) => {
      const expectedShortUrl = { foo: 'bar' };
      const axiosSpy = createAxiosMock({
        data: expectedShortUrl,
      });
      const { getShortUrl } = new ShlinkApiClient(axiosSpy, '', '');

      const result = await getShortUrl(shortCode, domain);

      expect(expectedShortUrl).toEqual(result);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: `/short-urls/${shortCode}`,
        method: 'GET',
        params: domain ? { domain } : {},
      }));
    });
  });

  describe('updateShortUrlTags', () => {
    it.each(shortCodesWithDomainCombinations)('properly updates short URL tags', async (shortCode, domain) => {
      const expectedTags = [ 'foo', 'bar' ];
      const axiosSpy = createAxiosMock({
        data: { tags: expectedTags },
      });
      const { updateShortUrlTags } = new ShlinkApiClient(axiosSpy, '', '');

      const result = await updateShortUrlTags(shortCode, domain, expectedTags);

      expect(expectedTags).toEqual(result);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: `/short-urls/${shortCode}/tags`,
        method: 'PUT',
        params: domain ? { domain } : {},
      }));
    });
  });

  describe('updateShortUrlMeta', () => {
    it.each(shortCodesWithDomainCombinations)('properly updates short URL meta', async (shortCode, domain) => {
      const expectedMeta = {
        maxVisits: 50,
        validSince: '2025-01-01T10:00:00+01:00',
      };
      const axiosSpy = createAxiosMock();
      const { updateShortUrlMeta } = new ShlinkApiClient(axiosSpy, '', '');

      const result = await updateShortUrlMeta(shortCode, domain, expectedMeta);

      expect(expectedMeta).toEqual(result);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: `/short-urls/${shortCode}`,
        method: 'PATCH',
        params: domain ? { domain } : {},
      }));
    });
  });

  describe('listTags', () => {
    it('properly returns list of tags', async () => {
      const expectedTags = [ 'foo', 'bar' ];
      const axiosSpy = createAxiosMock({
        data: {
          tags: { data: expectedTags },
        },
      });
      const { listTags } = new ShlinkApiClient(axiosSpy, '', '');

      const result = await listTags();

      expect({ tags: expectedTags }).toEqual(result);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({ url: '/tags', method: 'GET' }));
    });
  });

  describe('deleteTags', () => {
    it('properly deletes provided tags', async () => {
      const tags = [ 'foo', 'bar' ];
      const axiosSpy = createAxiosMock();
      const { deleteTags } = new ShlinkApiClient(axiosSpy, '', '');

      await deleteTags(tags);

      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: '/tags',
        method: 'DELETE',
        params: { tags },
      }));
    });
  });

  describe('editTag', () => {
    it('properly edits provided tag', async () => {
      const oldName = 'foo';
      const newName = 'bar';
      const axiosSpy = createAxiosMock();
      const { editTag } = new ShlinkApiClient(axiosSpy, '', '');

      await editTag(oldName, newName);

      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: '/tags',
        method: 'PUT',
        data: { oldName, newName },
      }));
    });
  });

  describe('deleteShortUrl', () => {
    it.each(shortCodesWithDomainCombinations)('properly deletes provided short URL', async (shortCode, domain) => {
      const axiosSpy = createAxiosMock({});
      const { deleteShortUrl } = new ShlinkApiClient(axiosSpy, '', '');

      await deleteShortUrl(shortCode, domain);

      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: `/short-urls/${shortCode}`,
        method: 'DELETE',
        params: domain ? { domain } : {},
      }));
    });
  });

  describe('health', () => {
    it('returns health data', async () => {
      const expectedData = {
        status: 'pass',
        version: '1.19.0',
      };
      const axiosSpy = createAxiosMock({ data: expectedData });
      const { health } = new ShlinkApiClient(axiosSpy, '', '');

      const result = await health();

      expect(axiosSpy).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });

  describe('mercureInfo', () => {
    it('returns mercure info', async () => {
      const expectedData = {
        token: 'abc.123.def',
        mercureHubUrl: 'http://example.com/.well-known/mercure',
      };
      const axiosSpy = createAxiosMock({ data: expectedData });
      const { mercureInfo } = new ShlinkApiClient(axiosSpy, '', '');

      const result = await mercureInfo();

      expect(axiosSpy).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });
});
