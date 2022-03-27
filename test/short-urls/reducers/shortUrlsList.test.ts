import { Mock } from 'ts-mockery';
import reducer, {
  LIST_SHORT_URLS,
  LIST_SHORT_URLS_ERROR,
  LIST_SHORT_URLS_START,
  listShortUrls,
} from '../../../src/short-urls/reducers/shortUrlsList';
import { SHORT_URL_DELETED } from '../../../src/short-urls/reducers/shortUrlDeletion';
import { CREATE_VISITS } from '../../../src/visits/reducers/visitCreation';
import { ShortUrl } from '../../../src/short-urls/data';
import ShlinkApiClient from '../../../src/api/services/ShlinkApiClient';
import { ShlinkPaginator, ShlinkShortUrlsResponse } from '../../../src/api/types';
import { CREATE_SHORT_URL } from '../../../src/short-urls/reducers/shortUrlCreation';
import { SHORT_URL_EDITED } from '../../../src/short-urls/reducers/shortUrlEdition';

describe('shortUrlsListReducer', () => {
  const shortCode = 'abc123';

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

    it('removes matching URL and reduces total on SHORT_URL_DELETED', () => {
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

    const createNewShortUrlVisit = (visitsCount: number) => ({
      shortUrl: { shortCode: 'abc123', visitsCount },
    });

    it.each([
      [[createNewShortUrlVisit(11)], 11],
      [[createNewShortUrlVisit(30)], 30],
      [[createNewShortUrlVisit(20), createNewShortUrlVisit(40)], 40],
      [[{}], 10],
      [[], 10],
    ])('updates visits count on CREATE_VISITS', (createdVisits, expectedCount) => {
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

      expect(reducer(state, { type: CREATE_VISITS, createdVisits } as any)).toEqual({
        shortUrls: {
          data: [
            { shortCode, domain: 'example.com', visitsCount: 5 },
            { shortCode, visitsCount: expectedCount },
            { shortCode: 'foo', visitsCount: 8 },
          ],
        },
        loading: false,
        error: false,
      });
    });

    it.each([
      [
        [
          Mock.of<ShortUrl>({ shortCode }),
          Mock.of<ShortUrl>({ shortCode, domain: 'example.com' }),
          Mock.of<ShortUrl>({ shortCode: 'foo' }),
        ],
        [{ shortCode: 'newOne' }, { shortCode }, { shortCode, domain: 'example.com' }, { shortCode: 'foo' }],
      ],
      [
        [
          Mock.of<ShortUrl>({ shortCode }),
          Mock.of<ShortUrl>({ shortCode: 'code' }),
          Mock.of<ShortUrl>({ shortCode: 'foo' }),
          Mock.of<ShortUrl>({ shortCode: 'bar' }),
          Mock.of<ShortUrl>({ shortCode: 'baz' }),
        ],
        [{ shortCode: 'newOne' }, { shortCode }, { shortCode: 'code' }, { shortCode: 'foo' }, { shortCode: 'bar' }],
      ],
      [
        [
          Mock.of<ShortUrl>({ shortCode }),
          Mock.of<ShortUrl>({ shortCode: 'code' }),
          Mock.of<ShortUrl>({ shortCode: 'foo' }),
          Mock.of<ShortUrl>({ shortCode: 'bar' }),
          Mock.of<ShortUrl>({ shortCode: 'baz1' }),
          Mock.of<ShortUrl>({ shortCode: 'baz2' }),
          Mock.of<ShortUrl>({ shortCode: 'baz3' }),
        ],
        [{ shortCode: 'newOne' }, { shortCode }, { shortCode: 'code' }, { shortCode: 'foo' }, { shortCode: 'bar' }],
      ],
    ])('prepends new short URL and increases total on CREATE_SHORT_URL', (data, expectedData) => {
      const newShortUrl = Mock.of<ShortUrl>({ shortCode: 'newOne' });
      const state = {
        shortUrls: Mock.of<ShlinkShortUrlsResponse>({
          data,
          pagination: Mock.of<ShlinkPaginator>({
            totalItems: 15,
          }),
        }),
        loading: false,
        error: false,
      };

      expect(reducer(state, { type: CREATE_SHORT_URL, result: newShortUrl } as any)).toEqual({
        shortUrls: {
          data: expectedData,
          pagination: { totalItems: 16 },
        },
        loading: false,
        error: false,
      });
    });

    it.each([
      ((): [ShortUrl, ShortUrl[], ShortUrl[]] => {
        const editedShortUrl = Mock.of<ShortUrl>({ shortCode: 'notMatching' });
        const list = [Mock.of<ShortUrl>({ shortCode: 'foo' }), Mock.of<ShortUrl>({ shortCode: 'bar' })];

        return [editedShortUrl, list, list];
      })(),
      ((): [ShortUrl, ShortUrl[], ShortUrl[]] => {
        const editedShortUrl = Mock.of<ShortUrl>({ shortCode: 'matching', longUrl: 'new_one' });
        const list = [
          Mock.of<ShortUrl>({ shortCode: 'matching', longUrl: 'old_one' }),
          Mock.of<ShortUrl>({ shortCode: 'bar' }),
        ];
        const expectedList = [editedShortUrl, list[1]];

        return [editedShortUrl, list, expectedList];
      })(),
    ])('updates matching short URL on SHORT_URL_EDITED', (editedShortUrl, initialList, expectedList) => {
      const state = {
        shortUrls: Mock.of<ShlinkShortUrlsResponse>({
          data: initialList,
          pagination: Mock.of<ShlinkPaginator>({
            totalItems: 15,
          }),
        }),
        loading: false,
        error: false,
      };

      const result = reducer(state, { type: SHORT_URL_EDITED, shortUrl: editedShortUrl } as any);

      expect(result.shortUrls?.data).toEqual(expectedList);
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
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: LIST_SHORT_URLS, shortUrls: [] });

      expect(listShortUrlsMock).toHaveBeenCalledTimes(1);
    });

    it('dispatches proper actions if API client request fails', async () => {
      const listShortUrlsMock = jest.fn().mockRejectedValue(undefined);
      const apiClientMock = Mock.of<ShlinkApiClient>({ listShortUrls: listShortUrlsMock });

      await listShortUrls(() => apiClientMock)()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: LIST_SHORT_URLS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: LIST_SHORT_URLS_ERROR });

      expect(listShortUrlsMock).toHaveBeenCalledTimes(1);
    });
  });
});
