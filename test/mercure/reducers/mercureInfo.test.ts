import { Mock } from 'ts-mockery';
import reducer, {
  GET_MERCURE_INFO_START,
  GET_MERCURE_INFO_ERROR,
  GET_MERCURE_INFO,
  loadMercureInfo,
  GetMercureInfoAction,
} from '../../../src/mercure/reducers/mercureInfo';
import { ShlinkMercureInfo } from '../../../src/api/types';
import ShlinkApiClient from '../../../src/utils/services/ShlinkApiClient';
import { GetState } from '../../../src/container/types';

describe('mercureInfoReducer', () => {
  const mercureInfo = {
    mercureHubUrl: 'http://example.com/.well-known/mercure',
    token: 'abc.123.def',
  };

  describe('reducer', () => {
    const action = (type: string, args: Partial<ShlinkMercureInfo> = {}) => Mock.of<GetMercureInfoAction>(
      { type, ...args },
    );

    it('returns loading on GET_MERCURE_INFO_START', () => {
      expect(reducer(undefined, action(GET_MERCURE_INFO_START))).toEqual({
        loading: true,
        error: false,
      });
    });

    it('returns error on GET_MERCURE_INFO_ERROR', () => {
      expect(reducer(undefined, action(GET_MERCURE_INFO_ERROR))).toEqual({
        loading: false,
        error: true,
      });
    });

    it('returns mercure info on GET_MERCURE_INFO', () => {
      expect(reducer(undefined, { type: GET_MERCURE_INFO, ...mercureInfo })).toEqual(expect.objectContaining({
        ...mercureInfo,
        loading: false,
        error: false,
      }));
    });
  });

  describe('loadMercureInfo', () => {
    const createApiClientMock = (result: Promise<ShlinkMercureInfo>) => Mock.of<ShlinkApiClient>({
      mercureInfo: jest.fn().mockReturnValue(result),
    });
    const dispatch = jest.fn();
    const createGetStateMock = (enabled: boolean): GetState => jest.fn().mockReturnValue({
      settings: {
        realTimeUpdates: { enabled },
      },
    });

    afterEach(jest.resetAllMocks);

    it('dispatches error when real time updates are disabled', async () => {
      const apiClientMock = createApiClientMock(Promise.resolve(mercureInfo));
      const getState = createGetStateMock(false);

      await loadMercureInfo(() => apiClientMock)()(dispatch, getState);

      expect(apiClientMock.mercureInfo).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: GET_MERCURE_INFO_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: GET_MERCURE_INFO_ERROR });
    });

    it('calls API on success', async () => {
      const apiClientMock = createApiClientMock(Promise.resolve(mercureInfo));
      const getState = createGetStateMock(true);

      await loadMercureInfo(() => apiClientMock)()(dispatch, getState);

      expect(apiClientMock.mercureInfo).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: GET_MERCURE_INFO_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: GET_MERCURE_INFO, ...mercureInfo });
    });

    it('throws error on failure', async () => {
      const error = 'Error';
      const apiClientMock = createApiClientMock(Promise.reject(error));
      const getState = createGetStateMock(true);

      await loadMercureInfo(() => apiClientMock)()(dispatch, getState);

      expect(apiClientMock.mercureInfo).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: GET_MERCURE_INFO_START });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: GET_MERCURE_INFO_ERROR });
    });
  });
});
