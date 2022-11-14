import { Mock } from 'ts-mockery';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { OptionalString } from '../../../src/utils/utils';
import { ShlinkDomain, ShlinkVisits, ShlinkVisitsOverview } from '../../../src/api/types';
import { ShortUrl, ShortUrlsOrder } from '../../../src/short-urls/data';
import { Fetch } from '../../../src/utils/types';

describe('ShlinkApiClient', () => {
  const buildFetch = (data: any) => jest.fn().mockResolvedValue(data);
  const buildRejectedFetch = (error: any) => jest.fn().mockRejectedValueOnce(error);
  const buildApiClient = (fetch: Fetch) => new ShlinkApiClient(fetch, '', '');
  const shortCodesWithDomainCombinations: [string, OptionalString][] = [
    ['abc123', null],
    ['abc123', undefined],
    ['abc123', 'example.com'],
  ];

  describe('listShortUrls', () => {
    const expectedList = ['foo', 'bar'];

    it('properly returns short URLs list', async () => {
      const { listShortUrls } = buildApiClient(buildFetch({
        shortUrls: expectedList,
      }));

      const actualList = await listShortUrls();

      expect(expectedList).toEqual(actualList);
    });

    it.each([
      [{ field: 'visits', dir: 'DESC' } as ShortUrlsOrder, '?orderBy=visits-DESC'],
      [{ field: 'longUrl', dir: 'ASC' } as ShortUrlsOrder, '?orderBy=longUrl-ASC'],
      [{ field: 'longUrl', dir: undefined } as ShortUrlsOrder, ''],
    ])('parses orderBy in params', async (orderBy, expectedOrderBy) => {
      const fetch = buildFetch({ data: expectedList });
      const { listShortUrls } = buildApiClient(fetch);

      await listShortUrls({ orderBy });

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/short-urls${expectedOrderBy}`), expect.anything());
    });
  });

  describe('createShortUrl', () => {
    const shortUrl = {
      bar: 'foo',
    };

    it('returns create short URL', async () => {
      const { createShortUrl } = buildApiClient(buildFetch(shortUrl));
      const result = await createShortUrl({ longUrl: '' });

      expect(result).toEqual(shortUrl);
    });

    it('removes all empty options', async () => {
      const fetch = buildFetch({ data: shortUrl });
      const { createShortUrl } = buildApiClient(fetch);

      await createShortUrl({ longUrl: 'bar', customSlug: undefined, maxVisits: null });

      expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        body: JSON.stringify({ longUrl: 'bar' }),
      }));
    });
  });

  describe('getShortUrlVisits', () => {
    it('properly returns short URL visits', async () => {
      const expectedVisits = ['foo', 'bar'];
      const fetch = buildFetch({
        visits: {
          data: expectedVisits,
        },
      });
      const { getShortUrlVisits } = buildApiClient(fetch);

      const actualVisits = await getShortUrlVisits('abc123', {});

      expect({ data: expectedVisits }).toEqual(actualVisits);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/short-urls/abc123/visits'), expect.objectContaining({
        method: 'GET',
      }));
    });
  });

  describe('getTagVisits', () => {
    it('properly returns tag visits', async () => {
      const expectedVisits = ['foo', 'bar'];
      const fetch = buildFetch({
        visits: {
          data: expectedVisits,
        },
      });
      const { getTagVisits } = buildApiClient(fetch);

      const actualVisits = await getTagVisits('foo', {});

      expect({ data: expectedVisits }).toEqual(actualVisits);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/tags/foo/visits'), expect.objectContaining({
        method: 'GET',
      }));
    });
  });

  describe('getDomainVisits', () => {
    it('properly returns domain visits', async () => {
      const expectedVisits = ['foo', 'bar'];
      const fetch = buildFetch({
        visits: {
          data: expectedVisits,
        },
      });
      const { getDomainVisits } = buildApiClient(fetch);

      const actualVisits = await getDomainVisits('foo.com', {});

      expect({ data: expectedVisits }).toEqual(actualVisits);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/domains/foo.com/visits'), expect.objectContaining({
        method: 'GET',
      }));
    });
  });

  describe('getShortUrl', () => {
    it.each(shortCodesWithDomainCombinations)('properly returns short URL', async (shortCode, domain) => {
      const expectedShortUrl = { foo: 'bar' };
      const fetch = buildFetch(expectedShortUrl);
      const { getShortUrl } = buildApiClient(fetch);
      const expectedQuery = domain ? `?domain=${domain}` : '';

      const result = await getShortUrl(shortCode, domain);

      expect(expectedShortUrl).toEqual(result);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/short-urls/${shortCode}${expectedQuery}`),
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('updateShortUrl', () => {
    it.each(shortCodesWithDomainCombinations)('properly updates short URL meta', async (shortCode, domain) => {
      const meta = {
        maxVisits: 50,
        validSince: '2025-01-01T10:00:00+01:00',
      };
      const expectedResp = Mock.of<ShortUrl>();
      const fetch = buildFetch(expectedResp);
      const { updateShortUrl } = buildApiClient(fetch);
      const expectedQuery = domain ? `?domain=${domain}` : '';

      const result = await updateShortUrl(shortCode, domain, meta);

      expect(expectedResp).toEqual(result);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/short-urls/${shortCode}${expectedQuery}`),
        expect.objectContaining({ method: 'PATCH' }),
      );
    });
  });

  describe('listTags', () => {
    it('properly returns list of tags', async () => {
      const expectedTags = ['foo', 'bar'];
      const fetch = buildFetch({
        tags: {
          data: expectedTags,
        },
      });
      const { listTags } = buildApiClient(fetch);

      const result = await listTags();

      expect({ tags: expectedTags }).toEqual(result);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/tags'), expect.objectContaining({ method: 'GET' }));
    });
  });

  describe('deleteTags', () => {
    it('properly deletes provided tags', async () => {
      const tags = ['foo', 'bar'];
      const fetch = buildFetch({});
      const { deleteTags } = buildApiClient(fetch);

      await deleteTags(tags);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/tags?${tags.map((tag) => `tags%5B%5D=${tag}`).join('&')}`),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  describe('editTag', () => {
    it('properly edits provided tag', async () => {
      const oldName = 'foo';
      const newName = 'bar';
      const fetch = buildFetch({});
      const { editTag } = buildApiClient(fetch);

      await editTag(oldName, newName);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/tags'), expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ oldName, newName }),
      }));
    });
  });

  describe('deleteShortUrl', () => {
    it.each(shortCodesWithDomainCombinations)('properly deletes provided short URL', async (shortCode, domain) => {
      const fetch = buildFetch({});
      const { deleteShortUrl } = buildApiClient(fetch);
      const expectedQuery = domain ? `?domain=${domain}` : '';

      await deleteShortUrl(shortCode, domain);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/short-urls/${shortCode}${expectedQuery}`),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  describe('health', () => {
    it('returns health data', async () => {
      const expectedData = {
        status: 'pass',
        version: '1.19.0',
      };
      const fetch = buildFetch(expectedData);
      const { health } = buildApiClient(fetch);

      const result = await health();

      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });

  describe('mercureInfo', () => {
    it('returns mercure info', async () => {
      const expectedData = {
        token: 'abc.123.def',
        mercureHubUrl: 'http://example.com/.well-known/mercure',
      };
      const fetch = buildFetch(expectedData);
      const { mercureInfo } = buildApiClient(fetch);

      const result = await mercureInfo();

      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });

  describe('listDomains', () => {
    it('returns domains', async () => {
      const expectedData = { data: [Mock.all<ShlinkDomain>(), Mock.all<ShlinkDomain>()] };
      const fetch = buildFetch({ domains: expectedData });
      const { listDomains } = buildApiClient(fetch);

      const result = await listDomains();

      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });

  describe('getVisitsOverview', () => {
    it('returns visits overview', async () => {
      const expectedData = Mock.all<ShlinkVisitsOverview>();
      const fetch = buildFetch({ visits: expectedData });
      const { getVisitsOverview } = buildApiClient(fetch);

      const result = await getVisitsOverview();

      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });

  describe('getOrphanVisits', () => {
    it('returns orphan visits', async () => {
      const fetch = buildFetch({ visits: Mock.of<ShlinkVisits>({ data: [] }) });
      const { getOrphanVisits } = buildApiClient(fetch);

      const result = await getOrphanVisits();

      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual({ data: [] });
    });
  });

  describe('getNonOrphanVisits', () => {
    it('returns non-orphan visits', async () => {
      const fetch = buildFetch({ visits: Mock.of<ShlinkVisits>({ data: [] }) });
      const { getNonOrphanVisits } = buildApiClient(fetch);

      const result = await getNonOrphanVisits();

      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual({ data: [] });
    });
  });

  describe('editDomainRedirects', () => {
    it('returns the redirects', async () => {
      const resp = { baseUrlRedirect: null, regular404Redirect: 'foo', invalidShortUrlRedirect: 'bar' };
      const fetch = buildFetch(resp);
      const { editDomainRedirects } = buildApiClient(fetch);

      const result = await editDomainRedirects({ domain: 'foo' });

      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual(resp);
    });

    it('retries request if API version is not supported', async () => {
      const fetch = buildRejectedFetch({ type: 'NOT_FOUND', status: 404 }).mockImplementation(buildFetch({}));
      const { editDomainRedirects } = buildApiClient(fetch);

      await editDomainRedirects({ domain: 'foo' });

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(1, expect.stringContaining('/v3/'), expect.anything());
      expect(fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('/v2/'), expect.anything());
    });
  });
});
