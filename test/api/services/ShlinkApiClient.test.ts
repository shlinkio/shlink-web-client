import { Mock } from 'ts-mockery';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { OptionalString } from '../../../src/utils/utils';
import { ShlinkDomain, ShlinkVisits, ShlinkVisitsOverview } from '../../../src/api/types';
import { ShortUrl, ShortUrlsOrder } from '../../../src/short-urls/data';
import { ErrorTypeV2, ErrorTypeV3 } from '../../../src/api/types/errors';
import { HttpClient } from '../../../src/common/services/HttpClient';

describe('ShlinkApiClient', () => {
  const fetchJson = jest.fn().mockResolvedValue({});
  const fetchEmpty = jest.fn().mockResolvedValue(undefined);
  const httpClient = Mock.of<HttpClient>({ fetchJson, fetchEmpty });
  const buildApiClient = () => new ShlinkApiClient(httpClient, '', '');
  const shortCodesWithDomainCombinations: [string, OptionalString][] = [
    ['abc123', null],
    ['abc123', undefined],
    ['abc123', 'example.com'],
  ];

  beforeEach(jest.clearAllMocks);

  describe('listShortUrls', () => {
    const expectedList = ['foo', 'bar'];

    it('properly returns short URLs list', async () => {
      fetchJson.mockResolvedValue({ shortUrls: expectedList });
      const { listShortUrls } = buildApiClient();

      const actualList = await listShortUrls();

      expect(expectedList).toEqual(actualList);
    });

    it.each([
      [{ field: 'visits', dir: 'DESC' } as ShortUrlsOrder, '?orderBy=visits-DESC'],
      [{ field: 'longUrl', dir: 'ASC' } as ShortUrlsOrder, '?orderBy=longUrl-ASC'],
      [{ field: 'longUrl', dir: undefined } as ShortUrlsOrder, ''],
    ])('parses orderBy in params', async (orderBy, expectedOrderBy) => {
      fetchJson.mockResolvedValue({ data: expectedList });
      const { listShortUrls } = buildApiClient();

      await listShortUrls({ orderBy });

      expect(fetchJson).toHaveBeenCalledWith(
        expect.stringContaining(`/short-urls${expectedOrderBy}`),
        expect.anything(),
      );
    });

    it.each([
      [{}, ''],
      [{ excludeMaxVisitsReached: false }, ''],
      [{ excludeMaxVisitsReached: true }, '?excludeMaxVisitsReached=true'],
      [{ excludePastValidUntil: false }, ''],
      [{ excludePastValidUntil: true }, '?excludePastValidUntil=true'],
      [
        { excludePastValidUntil: true, excludeMaxVisitsReached: true },
        '?excludeMaxVisitsReached=true&excludePastValidUntil=true',
      ],
    ])('parses disabled URLs params', async (params, expectedQuery) => {
      fetchJson.mockResolvedValue({ data: expectedList });
      const { listShortUrls } = buildApiClient();

      await listShortUrls(params);

      expect(fetchJson).toHaveBeenCalledWith(
        expect.stringContaining(`/short-urls${expectedQuery}`),
        expect.anything(),
      );
    });
  });

  describe('createShortUrl', () => {
    const shortUrl = {
      bar: 'foo',
    };

    it('returns create short URL', async () => {
      fetchJson.mockResolvedValue(shortUrl);
      const { createShortUrl } = buildApiClient();
      const result = await createShortUrl({ longUrl: '' });

      expect(result).toEqual(shortUrl);
    });

    it('removes all empty options', async () => {
      fetchJson.mockResolvedValue({ data: shortUrl });
      const { createShortUrl } = buildApiClient();

      await createShortUrl({ longUrl: 'bar', customSlug: undefined, maxVisits: null });

      expect(fetchJson).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        body: JSON.stringify({ longUrl: 'bar' }),
      }));
    });
  });

  describe('getShortUrlVisits', () => {
    it('properly returns short URL visits', async () => {
      const expectedVisits = ['foo', 'bar'];
      fetchJson.mockResolvedValue({
        visits: {
          data: expectedVisits,
        },
      });
      const { getShortUrlVisits } = buildApiClient();

      const actualVisits = await getShortUrlVisits('abc123', {});

      expect({ data: expectedVisits }).toEqual(actualVisits);
      expect(fetchJson).toHaveBeenCalledWith(
        expect.stringContaining('/short-urls/abc123/visits'),
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('getTagVisits', () => {
    it('properly returns tag visits', async () => {
      const expectedVisits = ['foo', 'bar'];
      fetchJson.mockResolvedValue({
        visits: {
          data: expectedVisits,
        },
      });
      const { getTagVisits } = buildApiClient();

      const actualVisits = await getTagVisits('foo', {});

      expect({ data: expectedVisits }).toEqual(actualVisits);
      expect(fetchJson).toHaveBeenCalledWith(expect.stringContaining('/tags/foo/visits'), expect.objectContaining({
        method: 'GET',
      }));
    });
  });

  describe('getDomainVisits', () => {
    it('properly returns domain visits', async () => {
      const expectedVisits = ['foo', 'bar'];
      fetchJson.mockResolvedValue({
        visits: {
          data: expectedVisits,
        },
      });
      const { getDomainVisits } = buildApiClient();

      const actualVisits = await getDomainVisits('foo.com', {});

      expect({ data: expectedVisits }).toEqual(actualVisits);
      expect(fetchJson).toHaveBeenCalledWith(
        expect.stringContaining('/domains/foo.com/visits'),
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('getShortUrl', () => {
    it.each(shortCodesWithDomainCombinations)('properly returns short URL', async (shortCode, domain) => {
      const expectedShortUrl = { foo: 'bar' };
      fetchJson.mockResolvedValue(expectedShortUrl);
      const { getShortUrl } = buildApiClient();
      const expectedQuery = domain ? `?domain=${domain}` : '';

      const result = await getShortUrl(shortCode, domain);

      expect(expectedShortUrl).toEqual(result);
      expect(fetchJson).toHaveBeenCalledWith(
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
      fetchJson.mockResolvedValue(expectedResp);
      const { updateShortUrl } = buildApiClient();
      const expectedQuery = domain ? `?domain=${domain}` : '';

      const result = await updateShortUrl(shortCode, domain, meta);

      expect(expectedResp).toEqual(result);
      expect(fetchJson).toHaveBeenCalledWith(
        expect.stringContaining(`/short-urls/${shortCode}${expectedQuery}`),
        expect.objectContaining({ method: 'PATCH' }),
      );
    });
  });

  describe('listTags', () => {
    it('properly returns list of tags', async () => {
      const expectedTags = ['foo', 'bar'];
      fetchJson.mockResolvedValue({
        tags: {
          data: expectedTags,
        },
      });
      const { listTags } = buildApiClient();

      const result = await listTags();

      expect({ tags: expectedTags }).toEqual(result);
      expect(fetchJson).toHaveBeenCalledWith(
        expect.stringContaining('/tags'),
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('deleteTags', () => {
    it('properly deletes provided tags', async () => {
      const tags = ['foo', 'bar'];
      const { deleteTags } = buildApiClient();

      await deleteTags(tags);

      expect(fetchEmpty).toHaveBeenCalledWith(
        expect.stringContaining(`/tags?${tags.map((tag) => `tags%5B%5D=${tag}`).join('&')}`),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  describe('editTag', () => {
    it('properly edits provided tag', async () => {
      const oldName = 'foo';
      const newName = 'bar';
      const { editTag } = buildApiClient();

      await editTag(oldName, newName);

      expect(fetchEmpty).toHaveBeenCalledWith(expect.stringContaining('/tags'), expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ oldName, newName }),
      }));
    });
  });

  describe('deleteShortUrl', () => {
    it.each(shortCodesWithDomainCombinations)('properly deletes provided short URL', async (shortCode, domain) => {
      const { deleteShortUrl } = buildApiClient();
      const expectedQuery = domain ? `?domain=${domain}` : '';

      await deleteShortUrl(shortCode, domain);

      expect(fetchEmpty).toHaveBeenCalledWith(
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
      fetchJson.mockResolvedValue(expectedData);
      const { health } = buildApiClient();

      const result = await health();

      expect(fetchJson).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });

  describe('mercureInfo', () => {
    it('returns mercure info', async () => {
      const expectedData = {
        token: 'abc.123.def',
        mercureHubUrl: 'http://example.com/.well-known/mercure',
      };
      fetchJson.mockResolvedValue(expectedData);
      const { mercureInfo } = buildApiClient();

      const result = await mercureInfo();

      expect(fetchJson).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });

  describe('listDomains', () => {
    it('returns domains', async () => {
      const expectedData = { data: [Mock.all<ShlinkDomain>(), Mock.all<ShlinkDomain>()] };
      fetchJson.mockResolvedValue({ domains: expectedData });
      const { listDomains } = buildApiClient();

      const result = await listDomains();

      expect(fetchJson).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });

  describe('getVisitsOverview', () => {
    it('returns visits overview', async () => {
      const expectedData = Mock.all<ShlinkVisitsOverview>();
      fetchJson.mockResolvedValue({ visits: expectedData });
      const { getVisitsOverview } = buildApiClient();

      const result = await getVisitsOverview();

      expect(fetchJson).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });

  describe('getOrphanVisits', () => {
    it('returns orphan visits', async () => {
      fetchJson.mockResolvedValue({ visits: Mock.of<ShlinkVisits>({ data: [] }) });
      const { getOrphanVisits } = buildApiClient();

      const result = await getOrphanVisits();

      expect(fetchJson).toHaveBeenCalled();
      expect(result).toEqual({ data: [] });
    });
  });

  describe('getNonOrphanVisits', () => {
    it('returns non-orphan visits', async () => {
      fetchJson.mockResolvedValue({ visits: Mock.of<ShlinkVisits>({ data: [] }) });
      const { getNonOrphanVisits } = buildApiClient();

      const result = await getNonOrphanVisits();

      expect(fetchJson).toHaveBeenCalled();
      expect(result).toEqual({ data: [] });
    });
  });

  describe('editDomainRedirects', () => {
    it('returns the redirects', async () => {
      const resp = { baseUrlRedirect: null, regular404Redirect: 'foo', invalidShortUrlRedirect: 'bar' };
      fetchJson.mockResolvedValue(resp);
      const { editDomainRedirects } = buildApiClient();

      const result = await editDomainRedirects({ domain: 'foo' });

      expect(fetchJson).toHaveBeenCalled();
      expect(result).toEqual(resp);
    });

    it.each([
      ['NOT_FOUND'],
      [ErrorTypeV2.NOT_FOUND],
      [ErrorTypeV3.NOT_FOUND],
    ])('retries request if API version is not supported', async (type) => {
      fetchJson
        .mockRejectedValueOnce({ type, detail: 'detail', title: 'title', status: 404 })
        .mockResolvedValue({});
      const { editDomainRedirects } = buildApiClient();

      await editDomainRedirects({ domain: 'foo' });

      expect(fetchJson).toHaveBeenCalledTimes(2);
      expect(fetchJson).toHaveBeenNthCalledWith(1, expect.stringContaining('/v3/'), expect.anything());
      expect(fetchJson).toHaveBeenNthCalledWith(2, expect.stringContaining('/v2/'), expect.anything());
    });
  });
});
