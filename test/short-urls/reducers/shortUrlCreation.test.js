import reducer, {
  CREATE_SHORT_URL_START,
  CREATE_SHORT_URL_ERROR,
  CREATE_SHORT_URL,
  RESET_CREATE_SHORT_URL,
  createShortUrl,
  resetCreateShortUrl,
} from '../../../src/short-urls/reducers/shortUrlCreation';

describe('shortUrlCreationReducer', () => {
  describe('reducer', () => {
    it('returns loading on CREATE_SHORT_URL_START', () => {
      expect(reducer({}, { type: CREATE_SHORT_URL_START })).toEqual({
        saving: true,
        error: false,
      });
    });

    it('returns error on CREATE_SHORT_URL_ERROR', () => {
      expect(reducer({}, { type: CREATE_SHORT_URL_ERROR })).toEqual({
        saving: false,
        error: true,
      });
    });

    it('returns result on CREATE_SHORT_URL', () => {
      expect(reducer({}, { type: CREATE_SHORT_URL, result: 'foo' })).toEqual({
        saving: false,
        error: false,
        result: 'foo',
      });
    });

    it('returns default state on RESET_CREATE_SHORT_URL', () => {
      expect(reducer({}, { type: RESET_CREATE_SHORT_URL })).toEqual({
        result: null,
        saving: false,
        error: false,
      });
    });
  });

  describe('resetCreateShortUrl', () => {
    it('returns proper action', () =>
      expect(resetCreateShortUrl()).toEqual({ type: RESET_CREATE_SHORT_URL }));
  });

  describe('createShortUrl', () => {
    const createApiClientMock = (result) => ({
      createShortUrl: jest.fn(() => result),
    });
    const dispatch = jest.fn();
    const getState = () => ({});

    afterEach(() => dispatch.mockReset());

    it('calls API on success', async () => {
      const result = 'foo';
      const apiClientMock = createApiClientMock(Promise.resolve(result));
      const dispatchable = createShortUrl(() => apiClientMock)({});

      await dispatchable(dispatch, getState);

      expect(apiClientMock.createShortUrl).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: CREATE_SHORT_URL_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: CREATE_SHORT_URL, result });
    });

    it('throws on error', async () => {
      const error = 'Error';
      const apiClientMock = createApiClientMock(Promise.reject(error));
      const dispatchable = createShortUrl(() => apiClientMock)({});

      try {
        await dispatchable(dispatch, getState);
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(apiClientMock.createShortUrl).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: CREATE_SHORT_URL_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: CREATE_SHORT_URL_ERROR });
    });
  });
});
