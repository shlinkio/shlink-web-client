import { fromPartial } from '@total-typescript/shoehorn';
import type { ShlinkApiClient } from '../../../../src/api/services/ShlinkApiClient';
import type { ShlinkShortUrlsResponse } from '../../../src/api/types';
import type { ShortUrl } from '../../../src/short-urls/data';
import { createShortUrl as createShortUrlCreator } from '../../../src/short-urls/reducers/shortUrlCreation';
import { shortUrlDeleted } from '../../../src/short-urls/reducers/shortUrlDeletion';
import { editShortUrl as editShortUrlCreator } from '../../../src/short-urls/reducers/shortUrlEdition';
import {
  listShortUrls as listShortUrlsCreator,
  shortUrlsListReducerCreator,
} from '../../../src/short-urls/reducers/shortUrlsList';
import { createNewVisits } from '../../../src/visits/reducers/visitCreation';
import type { CreateVisit } from '../../../src/visits/types';

describe('shortUrlsListReducer', () => {
  const shortCode = 'abc123';
  const listShortUrlsMock = vi.fn();
  const buildShlinkApiClient = () => fromPartial<ShlinkApiClient>({ listShortUrls: listShortUrlsMock });
  const listShortUrls = listShortUrlsCreator(buildShlinkApiClient);
  const editShortUrl = editShortUrlCreator(buildShlinkApiClient);
  const createShortUrl = createShortUrlCreator(buildShlinkApiClient);
  const { reducer } = shortUrlsListReducerCreator(listShortUrls, editShortUrl, createShortUrl);

  describe('reducer', () => {
    it('returns loading on LIST_SHORT_URLS_START', () =>
      expect(reducer(undefined, listShortUrls.pending(''))).toEqual({
        loading: true,
        error: false,
      }));

    it('returns short URLs on LIST_SHORT_URLS', () =>
      expect(reducer(undefined, listShortUrls.fulfilled(fromPartial({ data: [] }), ''))).toEqual({
        shortUrls: { data: [] },
        loading: false,
        error: false,
      }));

    it('returns error on LIST_SHORT_URLS_ERROR', () =>
      expect(reducer(undefined, listShortUrls.rejected(null, ''))).toEqual({
        loading: false,
        error: true,
      }));

    it('removes matching URL and reduces total on SHORT_URL_DELETED', () => {
      const state = {
        shortUrls: fromPartial<ShlinkShortUrlsResponse>({
          data: [
            { shortCode },
            { shortCode, domain: 'example.com' },
            { shortCode: 'foo' },
          ],
          pagination: { totalItems: 10 },
        }),
        loading: false,
        error: false,
      };

      expect(reducer(state, shortUrlDeleted(fromPartial({ shortCode })))).toEqual({
        shortUrls: {
          data: [{ shortCode, domain: 'example.com' }, { shortCode: 'foo' }],
          pagination: { totalItems: 9 },
        },
        loading: false,
        error: false,
      });
    });

    const createNewShortUrlVisit = (visitsCount: number) => fromPartial<CreateVisit>({
      shortUrl: { shortCode: 'abc123', visitsCount },
    });

    it.each([
      [[createNewShortUrlVisit(11)], 11],
      [[createNewShortUrlVisit(30)], 30],
      [[createNewShortUrlVisit(20), createNewShortUrlVisit(40)], 40],
      [[], 10],
    ])('updates visits count on CREATE_VISITS', (createdVisits, expectedCount) => {
      const state = {
        shortUrls: fromPartial<ShlinkShortUrlsResponse>({
          data: [
            { shortCode, domain: 'example.com', visitsCount: 5 },
            { shortCode, visitsCount: 10 },
            { shortCode: 'foo', visitsCount: 8 },
          ],
        }),
        loading: false,
        error: false,
      };

      expect(reducer(state, createNewVisits(createdVisits))).toEqual({
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
          fromPartial<ShortUrl>({ shortCode }),
          fromPartial<ShortUrl>({ shortCode, domain: 'example.com' }),
          fromPartial<ShortUrl>({ shortCode: 'foo' }),
        ],
        [{ shortCode: 'newOne' }, { shortCode }, { shortCode, domain: 'example.com' }, { shortCode: 'foo' }],
      ],
      [
        [
          fromPartial<ShortUrl>({ shortCode }),
          fromPartial<ShortUrl>({ shortCode: 'code' }),
          fromPartial<ShortUrl>({ shortCode: 'foo' }),
          fromPartial<ShortUrl>({ shortCode: 'bar' }),
          fromPartial<ShortUrl>({ shortCode: 'baz' }),
        ],
        [{ shortCode: 'newOne' }, { shortCode }, { shortCode: 'code' }, { shortCode: 'foo' }, { shortCode: 'bar' }],
      ],
      [
        [
          fromPartial<ShortUrl>({ shortCode }),
          fromPartial<ShortUrl>({ shortCode: 'code' }),
          fromPartial<ShortUrl>({ shortCode: 'foo' }),
          fromPartial<ShortUrl>({ shortCode: 'bar' }),
          fromPartial<ShortUrl>({ shortCode: 'baz1' }),
          fromPartial<ShortUrl>({ shortCode: 'baz2' }),
          fromPartial<ShortUrl>({ shortCode: 'baz3' }),
        ],
        [{ shortCode: 'newOne' }, { shortCode }, { shortCode: 'code' }, { shortCode: 'foo' }, { shortCode: 'bar' }],
      ],
    ])('prepends new short URL and increases total on CREATE_SHORT_URL', (data, expectedData) => {
      const newShortUrl = fromPartial<ShortUrl>({ shortCode: 'newOne' });
      const state = {
        shortUrls: fromPartial<ShlinkShortUrlsResponse>({
          data,
          pagination: { totalItems: 15 },
        }),
        loading: false,
        error: false,
      };

      expect(reducer(state, createShortUrl.fulfilled(newShortUrl, '', fromPartial({})))).toEqual({
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
        const editedShortUrl = fromPartial<ShortUrl>({ shortCode: 'notMatching' });
        const list: ShortUrl[] = [fromPartial({ shortCode: 'foo' }), fromPartial({ shortCode: 'bar' })];

        return [editedShortUrl, list, list];
      })(),
      ((): [ShortUrl, ShortUrl[], ShortUrl[]] => {
        const editedShortUrl = fromPartial<ShortUrl>({ shortCode: 'matching', longUrl: 'new_one' });
        const list: ShortUrl[] = [
          fromPartial({ shortCode: 'matching', longUrl: 'old_one' }),
          fromPartial({ shortCode: 'bar' }),
        ];
        const expectedList = [editedShortUrl, list[1]];

        return [editedShortUrl, list, expectedList];
      })(),
    ])('updates matching short URL on SHORT_URL_EDITED', (editedShortUrl, initialList, expectedList) => {
      const state = {
        shortUrls: fromPartial<ShlinkShortUrlsResponse>({
          data: initialList,
          pagination: { totalItems: 15 },
        }),
        loading: false,
        error: false,
      };

      const result = reducer(state, editShortUrl.fulfilled(editedShortUrl, '', fromPartial({})));

      expect(result.shortUrls?.data).toEqual(expectedList);
    });
  });

  describe('listShortUrls', () => {
    const dispatch = vi.fn();
    const getState = vi.fn().mockReturnValue({ selectedServer: {} });

    it('dispatches proper actions if API client request succeeds', async () => {
      listShortUrlsMock.mockResolvedValue({});

      await listShortUrls()(dispatch, getState, {});

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({ payload: {} }));

      expect(listShortUrlsMock).toHaveBeenCalledTimes(1);
    });
  });
});
