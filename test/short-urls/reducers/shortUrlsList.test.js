import reducer, {
  LIST_SHORT_URLS,
  LIST_SHORT_URLS_ERROR,
  LIST_SHORT_URLS_START,
  listShortUrls,
} from '../../../src/short-urls/reducers/shortUrlsList';
import { SHORT_URL_TAGS_EDITED } from '../../../src/short-urls/reducers/shortUrlTags';
import { SHORT_URL_DELETED } from '../../../src/short-urls/reducers/shortUrlDeletion';

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

    it('Updates tags on matching URL on SHORT_URL_TAGS_EDITED', () => {
      const shortCode = 'abc123';
      const tags = [ 'foo', 'bar', 'baz' ];
      const state = {
        shortUrls: {
          data: [
            { shortCode, tags: [] },
            { shortCode: 'foo', tags: [] },
          ],
        },
      };

      expect(reducer(state, { type: SHORT_URL_TAGS_EDITED, shortCode, tags })).toEqual({
        shortUrls: {
          data: [
            { shortCode, tags },
            { shortCode: 'foo', tags: [] },
          ],
        },
      });
    });

    it('Removes matching URL on SHORT_URL_DELETED', () => {
      const shortCode = 'abc123';
      const state = {
        shortUrls: {
          data: [
            { shortCode },
            { shortCode: 'foo' },
          ],
        },
      };

      expect(reducer(state, { type: SHORT_URL_DELETED, shortCode })).toEqual({
        shortUrls: {
          data: [{ shortCode: 'foo' }],
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
      const expectedDispatchCalls = 2;

      await listShortUrls(() => apiClientMock)()(dispatch, getState);
      const [ firstDispatchCallArgs, secondDispatchCallArgs ] = dispatch.mock.calls;

      expect(dispatch).toHaveBeenCalledTimes(expectedDispatchCalls);
      expect(firstDispatchCallArgs).toEqual([{ type: LIST_SHORT_URLS_START }]);
      expect(secondDispatchCallArgs).toEqual([{ type: LIST_SHORT_URLS, shortUrls: [], params: {} }]);

      expect(apiClientMock.listShortUrls).toHaveBeenCalledTimes(1);
    });

    it('dispatches proper actions if API client request fails', async () => {
      const apiClientMock = {
        listShortUrls: jest.fn().mockRejectedValue(),
      };
      const expectedDispatchCalls = 2;

      await listShortUrls(() => apiClientMock)()(dispatch, getState);
      const [ firstDispatchCallArgs, secondDispatchCallArgs ] = dispatch.mock.calls;

      expect(dispatch).toHaveBeenCalledTimes(expectedDispatchCalls);
      expect(firstDispatchCallArgs).toEqual([{ type: LIST_SHORT_URLS_START }]);
      expect(secondDispatchCallArgs).toEqual([{ type: LIST_SHORT_URLS_ERROR, params: {} }]);

      expect(apiClientMock.listShortUrls).toHaveBeenCalledTimes(1);
    });
  });
});
