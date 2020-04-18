import reducer, {
  GET_MERCURE_INFO_START,
  GET_MERCURE_INFO_ERROR,
  GET_MERCURE_INFO,
  loadMercureInfo,
} from '../../src/mercure/reducers/mercureInfo.js';

describe('mercureInfoReducer', () => {
  const mercureInfo = {
    mercureHubUrl: 'http://example.com/.well-known/mercure',
    token: 'abc.123.def',
  };

  describe('reducer', () => {
    it('returns loading on GET_MERCURE_INFO_START', () => {
      expect(reducer({}, { type: GET_MERCURE_INFO_START })).toEqual({
        loading: true,
        error: false,
      });
    });

    it('returns error on GET_MERCURE_INFO_ERROR', () => {
      expect(reducer({}, { type: GET_MERCURE_INFO_ERROR })).toEqual({
        loading: false,
        error: true,
      });
    });

    it('returns mercure info on GET_MERCURE_INFO', () => {
      expect(reducer({}, { type: GET_MERCURE_INFO, ...mercureInfo })).toEqual({
        ...mercureInfo,
        loading: false,
        error: false,
      });
    });
  });

  describe('loadMercureInfo', () => {
    const createApiClientMock = (result) => ({
      mercureInfo: jest.fn(() => result),
    });
    const dispatch = jest.fn();
    const getState = () => ({});

    afterEach(jest.resetAllMocks);

    it('calls API on success', async () => {
      const apiClientMock = createApiClientMock(Promise.resolve(mercureInfo));

      await loadMercureInfo(() => apiClientMock)()(dispatch, getState());

      expect(apiClientMock.mercureInfo).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: GET_MERCURE_INFO_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: GET_MERCURE_INFO, ...mercureInfo });
    });

    it('throws error on failure', async () => {
      const error = 'Error';
      const apiClientMock = createApiClientMock(Promise.reject(error));

      await loadMercureInfo(() => apiClientMock)()(dispatch, getState());

      expect(apiClientMock.mercureInfo).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: GET_MERCURE_INFO_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: GET_MERCURE_INFO_ERROR });
    });
  });
});
