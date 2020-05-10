import reducer, {
  LIST_SHORT_URLS,
  LIST_SHORT_URLS_ERROR,
  LIST_SHORT_URLS_START,
  listShortUrls,
} from '../../../src/short-urls/reducers/shortUrlsList';
import { SHORT_URL_TAGS_EDITED } from '../../../src/short-urls/reducers/shortUrlTags';
import { SHORT_URL_DELETED } from '../../../src/short-urls/reducers/shortUrlDeletion';
import { SHORT_URL_META_EDITED } from '../../../src/short-urls/reducers/shortUrlMeta';
import { CREATE_VISIT } from '../../../src/visits/reducers/visitCreation';

describe('shortUrlsListReducer', () => {
  describe('reducer', () => {
    it('returns loading on LIST_SHORT_URLS_START', () =>
      expect(reducer(undefined, { type: LIST_SHORT_URLS_START })).toEqual({
        shortUrls: {},
        loading: true,
        error: false,
      }));

    it('returns short URLs on LIST_SHORT_URLS', () =>
      expect(reducer(undefined, { type: LIST_SHORT_URLS, shortUrls: { data: [], paginator: {} } })).toEqual({
        shortUrls: { data: [], paginator: {} },
        loading: false,
        error: false,
      }));

    it('returns error on LIST_SHORT_URLS_ERROR', () =>
      expect(reducer(undefined, { type: LIST_SHORT_URLS_ERROR })).toEqual({
        shortUrls: {},
        loading: false,
        error: true,
      }));

    it('updates tags on matching URL on SHORT_URL_TAGS_EDITED', () => {
      const shortCode = 'abc123';
      const tags = [ 'foo', 'bar', 'baz' ];
      const state = {
        shortUrls: {
          data: [
            { shortCode, tags: [] },
            { shortCode, tags: [], domain: 'example.com' },
            { shortCode: 'foo', tags: [] },
          ],
        },
      };

      expect(reducer(state, { type: SHORT_URL_TAGS_EDITED, shortCode, tags, domain: null })).toEqual({
        shortUrls: {
          data: [
            { shortCode, tags },
            { shortCode, tags: [], domain: 'example.com' },
            { shortCode: 'foo', tags: [] },
          ],
        },
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
        shortUrls: {
          data: [
            { shortCode, meta: { maxVisits: 10 }, domain },
            { shortCode, meta: { maxVisits: 50 } },
            { shortCode: 'foo', meta: null },
          ],
        },
      };

      expect(reducer(state, { type: SHORT_URL_META_EDITED, shortCode, meta, domain })).toEqual({
        shortUrls: {
          data: [
            { shortCode, meta, domain: 'example.com' },
            { shortCode, meta: { maxVisits: 50 } },
            { shortCode: 'foo', meta: null },
          ],
        },
      });
    });

    it('removes matching URL on SHORT_URL_DELETED', () => {
      const shortCode = 'abc123';
      const state = {
        shortUrls: {
          data: [
            { shortCode },
            { shortCode, domain: 'example.com' },
            { shortCode: 'foo' },
          ],
        },
      };

      expect(reducer(state, { type: SHORT_URL_DELETED, shortCode })).toEqual({
        shortUrls: {
          data: [{ shortCode, domain: 'example.com' }, { shortCode: 'foo' }],
        },
      });
    });

    it('updates visits count on CREATE_VISIT', () => {
      const shortCode = 'abc123';
      const shortUrl = {
        shortCode,
        visitsCount: 11,
      };
      const state = {
        shortUrls: {
          data: [
            { shortCode, domain: 'example.com', visitsCount: 5 },
            { shortCode, visitsCount: 10 },
            { shortCode: 'foo', visitsCount: 8 },
          ],
        },
      };

      expect(reducer(state, { type: CREATE_VISIT, shortUrl })).toEqual({
        shortUrls: {
          data: [
            { shortCode, domain: 'example.com', visitsCount: 5 },
            { shortCode, visitsCount: 11 },
            { shortCode: 'foo', visitsCount: 8 },
          ],
        },
      });
    });
  });

  describe('listShortUrls', () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({ selectedServer: {} });

    afterEach(() => {
      dispatch.mockReset();
      getState.mockClear();
    });

    it('dispatches proper actions if API client request succeeds', async () => {
      const apiClientMock = {
        listShortUrls: jest.fn().mockResolvedValue([]),
      };

      await listShortUrls(() => apiClientMock)()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: LIST_SHORT_URLS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: LIST_SHORT_URLS, shortUrls: [], params: {} });

      expect(apiClientMock.listShortUrls).toHaveBeenCalledTimes(1);
    });

    it('dispatches proper actions if API client request fails', async () => {
      const apiClientMock = {
        listShortUrls: jest.fn().mockRejectedValue(),
      };

      await listShortUrls(() => apiClientMock)()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: LIST_SHORT_URLS_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: LIST_SHORT_URLS_ERROR, params: {} });

      expect(apiClientMock.listShortUrls).toHaveBeenCalledTimes(1);
    });
  });
});
