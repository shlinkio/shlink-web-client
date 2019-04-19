import reducer, {
  DELETE_SHORT_URL, DELETE_SHORT_URL_ERROR,
  DELETE_SHORT_URL_START,
  RESET_DELETE_SHORT_URL,
  SHORT_URL_DELETED,
  resetDeleteShortUrl,
  shortUrlDeleted,
  deleteShortUrl,
} from '../../../src/short-urls/reducers/shortUrlDeletion';

describe('shortUrlDeletionReducer', () => {
  describe('reducer', () => {
    it('returns loading on DELETE_SHORT_URL_START', () =>
      expect(reducer(undefined, { type: DELETE_SHORT_URL_START })).toEqual({
        shortCode: '',
        loading: true,
        error: false,
        errorData: {},
      }));

    it('returns default on RESET_DELETE_SHORT_URL', () =>
      expect(reducer(undefined, { type: RESET_DELETE_SHORT_URL })).toEqual({
        shortCode: '',
        loading: false,
        error: false,
        errorData: {},
      }));

    it('returns shortCode on DELETE_SHORT_URL', () =>
      expect(reducer(undefined, { type: DELETE_SHORT_URL, shortCode: 'foo' })).toEqual({
        shortCode: 'foo',
        loading: false,
        error: false,
        errorData: {},
      }));

    it('returns errorData on DELETE_SHORT_URL_ERROR', () => {
      const errorData = { foo: 'bar' };

      expect(reducer(undefined, { type: DELETE_SHORT_URL_ERROR, errorData })).toEqual({
        shortCode: '',
        loading: false,
        error: true,
        errorData,
      });
    });
  });

  describe('resetDeleteShortUrl', () => {
    it('returns expected action', () =>
      expect(resetDeleteShortUrl()).toEqual({ type: RESET_DELETE_SHORT_URL }));
  });

  describe('shortUrlDeleted', () => {
    it('returns expected action', () =>
      expect(shortUrlDeleted('abc123')).toEqual({ type: SHORT_URL_DELETED, shortCode: 'abc123' }));
  });

  describe('deleteShortUrl', () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({ selectedServer: {} });

    afterEach(() => {
      dispatch.mockReset();
      getState.mockClear();
    });

    it('dispatches proper actions if API client request succeeds', async () => {
      const apiClientMock = {
        deleteShortUrl: jest.fn(() => ''),
      };
      const shortCode = 'abc123';
      const expectedDispatchCalls = 2;

      await deleteShortUrl(() => apiClientMock)(shortCode)(dispatch, getState);
      const [ firstDispatchCallArgs, secondDispatchCallArgs ] = dispatch.mock.calls;

      expect(dispatch).toHaveBeenCalledTimes(expectedDispatchCalls);
      expect(firstDispatchCallArgs).toEqual([{ type: DELETE_SHORT_URL_START }]);
      expect(secondDispatchCallArgs).toEqual([{ type: DELETE_SHORT_URL, shortCode }]);

      expect(apiClientMock.deleteShortUrl).toHaveBeenCalledTimes(1);
      expect(apiClientMock.deleteShortUrl.mock.calls[0]).toEqual([ shortCode ]);
    });

    it('dispatches proper actions if API client request fails', async () => {
      const data = { foo: 'bar' };
      const error = { response: { data } };
      const apiClientMock = {
        deleteShortUrl: jest.fn(() => Promise.reject(error)),
      };
      const shortCode = 'abc123';
      const expectedDispatchCalls = 2;

      try {
        await deleteShortUrl(() => apiClientMock)(shortCode)(dispatch, getState);
      } catch (e) {
        expect(e).toEqual(error);
      }
      const [ firstDispatchCallArgs, secondDispatchCallArgs ] = dispatch.mock.calls;

      expect(dispatch).toHaveBeenCalledTimes(expectedDispatchCalls);
      expect(firstDispatchCallArgs).toEqual([{ type: DELETE_SHORT_URL_START }]);
      expect(secondDispatchCallArgs).toEqual([{ type: DELETE_SHORT_URL_ERROR, errorData: data }]);

      expect(apiClientMock.deleteShortUrl).toHaveBeenCalledTimes(1);
      expect(apiClientMock.deleteShortUrl.mock.calls[0]).toEqual([ shortCode ]);
    });
  });
});
