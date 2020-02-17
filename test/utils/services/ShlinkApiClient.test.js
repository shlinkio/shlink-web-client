import ShlinkApiClient from '../../../src/utils/services/ShlinkApiClient';

describe('ShlinkApiClient', () => {
  const createAxiosMock = (data) => () => Promise.resolve(data);
  const createApiClient = (data) => new ShlinkApiClient(createAxiosMock(data));
  const shortCodesWithDomainCombinations = [
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
      const axiosSpy = jest.fn(createAxiosMock({ data: shortUrl }));
      const { createShortUrl } = new ShlinkApiClient(axiosSpy);

      await createShortUrl(
        { foo: 'bar', empty: undefined, anotherEmpty: null }
      );

      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({ data: { foo: 'bar' } }));
    });
  });

  describe('getShortUrlVisits', () => {
    it('properly returns short URL visits', async () => {
      const expectedVisits = [ 'foo', 'bar' ];
      const axiosSpy = jest.fn(createAxiosMock({
        data: {
          visits: {
            data: expectedVisits,
          },
        },
      }));
      const { getShortUrlVisits } = new ShlinkApiClient(axiosSpy);

      const actualVisits = await getShortUrlVisits('abc123', {});

      expect({ data: expectedVisits }).toEqual(actualVisits);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: '/short-urls/abc123/visits',
        method: 'GET',
      }));
    });
  });

  describe('getShortUrl', () => {
    it.each(shortCodesWithDomainCombinations)('properly returns short URL', async (shortCode, domain) => {
      const expectedShortUrl = { foo: 'bar' };
      const axiosSpy = jest.fn(createAxiosMock({
        data: expectedShortUrl,
      }));
      const { getShortUrl } = new ShlinkApiClient(axiosSpy);

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
      const axiosSpy = jest.fn(createAxiosMock({
        data: { tags: expectedTags },
      }));
      const { updateShortUrlTags } = new ShlinkApiClient(axiosSpy);

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
      const axiosSpy = jest.fn(createAxiosMock());
      const { updateShortUrlMeta } = new ShlinkApiClient(axiosSpy);

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
      const axiosSpy = jest.fn(createAxiosMock({
        data: {
          tags: { data: expectedTags },
        },
      }));
      const { listTags } = new ShlinkApiClient(axiosSpy);

      const result = await listTags();

      expect(expectedTags).toEqual(result);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({ url: '/tags', method: 'GET' }));
    });
  });

  describe('deleteTags', () => {
    it('properly deletes provided tags', async () => {
      const tags = [ 'foo', 'bar' ];
      const axiosSpy = jest.fn(createAxiosMock({}));
      const { deleteTags } = new ShlinkApiClient(axiosSpy);

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
      const axiosSpy = jest.fn(createAxiosMock({}));
      const { editTag } = new ShlinkApiClient(axiosSpy);

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
      const axiosSpy = jest.fn(createAxiosMock({}));
      const { deleteShortUrl } = new ShlinkApiClient(axiosSpy);

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
      const axiosSpy = jest.fn(createAxiosMock({ data: expectedData }));
      const { health } = new ShlinkApiClient(axiosSpy);

      const result = await health();

      expect(axiosSpy).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });
});
