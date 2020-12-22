import { Mock } from 'ts-mockery';
import reducer, {
  LIST_SHORT_URLS,
  LIST_SHORT_URLS_ERROR,
  LIST_SHORT_URLS_START,
  listShortUrls,
} from '../../../src/short-urls/reducers/shortUrlsList';
import { SHORT_URL_TAGS_EDITED } from '../../../src/short-urls/reducers/shortUrlTags';
import { SHORT_URL_DELETED } from '../../../src/short-urls/reducers/shortUrlDeletion';
import { SHORT_URL_META_EDITED } from '../../../src/short-urls/reducers/shortUrlMeta';
import { CREATE_VISITS } from '../../../src/visits/reducers/visitCreation';
import { ShortUrl } from '../../../src/short-urls/data';
import ShlinkApiClient from '../../../src/api/services/ShlinkApiClient';
import { ShlinkPaginator, ShlinkShortUrlsResponse } from '../../../src/api/types';
import { CREATE_SHORT_URL } from '../../../src/short-urls/reducers/shortUrlCreation';
import { SHORT_URL_EDITED } from '../../../src/short-urls/reducers/shortUrlEdition';

describe('shortUrlsListReducer', () => {
  describe('reducer', () => {
    it('returns loading on LIST_SHORT_URLS_START', () =>
      expect(reducer(undefined, { type: LIST_SHORT_URLS_START } as any)).toEqual({
        loading: true,
        error: false,
      }));

    it('returns short URLs on LIST_SHORT_URLS', () =>
      expect(reducer(undefined, { type: LIST_SHORT_URLS, shortUrls: { data: [] } } as any)).toEqual({
        shortUrls: { data: [] },
        loading: false,
        error: false,
      }));

    it('returns error on LIST_SHORT_URLS_ERROR', () =>
      expect(reducer(undefined, { type: LIST_SHORT_URLS_ERROR } as any)).toEqual({
        loading: false,
        error: true,
      }));

    it('updates tags on matching URL on SHORT_URL_TAGS_EDITED', () => {
      const shortCode = 'abc123';
      const tags = [ 'foo', 'bar', 'baz' ];
      const state = {
        shortUrls: Mock.of<ShlinkShortUrlsResponse>({
          data: [
            Mock.of<ShortUrl>({ shortCode, tags: [] }),
            Mock.of<ShortUrl>({ shortCode, tags: [], domain: 'example.com' }),
            Mock.of<ShortUrl>({ shortCode: 'foo', tags: [] }),
          ],
        }),
        loading: false,
        error: false,
      };

      expect(reducer(state, { type: SHORT_URL_TAGS_EDITED, shortCode, tags, domain: null } as any)).toEqual({
        shortUrls: {
          data: [
            { shortCode, tags },
            { shortCode, tags: [], domain: 'example.com' },
            { shortCode: 'foo', tags: [] },
          ],
        },
        loading: false,
        error: false,
      });
    });

    it('updates meta on matching URL on SHORT_URL_META_EDITED', () => {
      const shortCode = 'abc123';
      const domain = 'example.com';
      const meta = {
        maxVisits: 5,
        validSince: '2020-05-05',
      };
      const state = {
        shortUrls: Mock.of<ShlinkShortUrlsResponse>({
          data: [
            Mock.of<ShortUrl>({ shortCode, meta: { maxVisits: 10 }, domain }),
            Mock.of<ShortUrl>({ shortCode, meta: { maxVisits: 50 } }),
            Mock.of<ShortUrl>({ shortCode: 'foo', meta: {} }),
          ],
        }),
        loading: false,
        error: false,
      };

      expect(reducer(state, { type: SHORT_URL_META_EDITED, shortCode, meta, domain } as any)).toEqual({
        shortUrls: {
          data: [
            { shortCode, meta, domain: 'example.com' },
            { shortCode, meta: { maxVisits: 50 } },
            { shortCode: 'foo', meta: {} },
          ],
        },
        loading: false,
        error: false,
      });
    });

    it('removes matching URL and reduces total on SHORT_URL_DELETED', () => {
      const shortCode = 'abc123';
      const state = {
        shortUrls: Mock.of<ShlinkShortUrlsResponse>({
          data: [
            Mock.of<ShortUrl>({ shortCode }),
            Mock.of<ShortUrl>({ shortCode, domain: 'example.com' }),
            Mock.of<ShortUrl>({ shortCode: 'foo' }),
          ],
          pagination: Mock.of<ShlinkPaginator>({
            totalItems: 10,
          }),
        }),
        loading: false,
        error: false,
      };

      expect(reducer(state, { type: SHORT_URL_DELETED, shortCode } as any)).toEqual({
        shortUrls: {
          data: [{ shortCode, domain: 'example.com' }, { shortCode: 'foo' }],
          pagination: { totalItems: 9 },
        },
        loading: false,
        error: false,
      });
    });

    it('updates edited short URL on SHORT_URL_EDITED', () => {
      const shortCode = 'abc123';
      const state = {
        shortUrls: Mock.of<ShlinkShortUrlsResponse>({
          data: [
            Mock.of<ShortUrl>({ shortCode, longUrl: 'old' }),
            Mock.of<ShortUrl>({ shortCode, domain: 'example.com', longUrl: 'foo' }),
            Mock.of<ShortUrl>({ shortCode: 'foo', longUrl: 'bar' }),
          ],
        }),
        loading: false,
        error: false,
      };

      expect(reducer(state, { type: SHORT_URL_EDITED, shortCode, longUrl: 'newValue' } as any)).toEqual({
        shortUrls: {
          data: [
            { shortCode, longUrl: 'newValue' },
            { shortCode, longUrl: 'foo', domain: 'example.com' },
            { shortCode: 'foo', longUrl: 'bar' },
          ],
        },
        loading: false,
        error: false,
      });
    });

    it('updates visits count on CREATE_VISIT', () => {
      const shortCode = 'abc123';
      const shortUrl = {
        shortCode,
        visitsCount: 11,
      };
      const state = {
        shortUrls: Mock.of<ShlinkShortUrlsResponse>({
          data: [
            Mock.of<ShortUrl>({ shortCode, domain: 'example.com', visitsCount: 5 }),
            Mock.of<ShortUrl>({ shortCode, visitsCount: 10 }),
            Mock.of<ShortUrl>({ shortCode: 'foo', visitsCount: 8 }),
          ],
        }),
        loading: false,
        error: false,
      };

      expect(reducer(state, { type: CREATE_VISITS, createdVisits: [{ shortUrl }] } as any)).toEqual({
        shortUrls: {
          data: [
            { shortCode, domain: 'example.com', visitsCount: 5 },
            { shortCode, visitsCount: 11 },
            { shortCode: 'foo', visitsCount: 8 },
          ],
        },
        loading: false,
        error: false,
      });
    });

    it('prepends new short URL and increases total on CREATE_SHORT_URL', () => {
      const newShortUrl = Mock.of<ShortUrl>({ shortCode: 'newOne' });
      const shortCode = 'abc123';
      const state = {
        shortUrls: Mock.of<ShlinkShortUrlsResponse>({
          data: [
            Mock.of<ShortUrl>({ shortCode }),
            Mock.of<ShortUrl>({ shortCode, domain: 'example.com' }),
            Mock.of<ShortUrl>({ shortCode: 'foo' }),
          ],
          pagination: Mock.of<ShlinkPaginator>({
            totalItems: 15,
          }),
        }),
        loading: false,
        error: false,
      };

      expect(reducer(state, { type: CREATE_SHORT_URL, result: newShortUrl } as any)).toEqual({
        shortUrls: {
          data: [{ shortCode: 'newOne' }, { shortCode }, { shortCode, domain: 'example.com' }],
          pagination: { totalItems: 16 },
        },
        loading: false,
        error: false,
      });
    });
  });

  describe('listShortUrls', () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({ selectedServer: {} });

    afterEach(jest.clearAllMocks);

    it('dispatches proper actions if API client request succeeds', async () => {
      const listShortUrlsMock = jest.fn().mockResolvedValue([]);
      const apiClientMock = Mock.of<ShlinkApiClient>({ listShortUrls: listShortUrlsMock });

      await listShortUrls(() => apiClientMock)()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: LIST_SHORT_URLS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: LIST_SHORT_URLS, shortUrls: [], params: {} });

      expect(listShortUrlsMock).toHaveBeenCalledTimes(1);
    });

    it('dispatches proper actions if API client request fails', async () => {
      const listShortUrlsMock = jest.fn().mockRejectedValue(undefined);
      const apiClientMock = Mock.of<ShlinkApiClient>({ listShortUrls: listShortUrlsMock });

      await listShortUrls(() => apiClientMock)()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: LIST_SHORT_URLS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: LIST_SHORT_URLS_ERROR, params: {} });

      expect(listShortUrlsMock).toHaveBeenCalledTimes(1);
    });
  });
});
