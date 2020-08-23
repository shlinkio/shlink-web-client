import { Mock } from 'ts-mockery';
import { Action } from 'redux-actions';
import reducer, {
  GET_MERCURE_INFO_START,
  GET_MERCURE_INFO_ERROR,
  GET_MERCURE_INFO,
  loadMercureInfo,
} from '../../../src/mercure/reducers/mercureInfo';
import { ShlinkMercureInfo } from '../../../src/utils/services/types';
import ShlinkApiClient from '../../../src/utils/services/ShlinkApiClient';
import { GetState } from '../../../src/container/types';

describe('mercureInfoReducer', () => {
  const mercureInfo = {
    mercureHubUrl: 'http://example.com/.well-known/mercure',
    token: 'abc.123.def',
  };

  describe('reducer', () => {
    it('returns loading on GET_MERCURE_INFO_START', () => {
      expect(reducer(undefined, { type: GET_MERCURE_INFO_START } as Action<ShlinkMercureInfo>)).toEqual({
        loading: true,
        error: false,
      });
    });

    it('returns error on GET_MERCURE_INFO_ERROR', () => {
      expect(reducer(undefined, { type: GET_MERCURE_INFO_ERROR } as Action<ShlinkMercureInfo>)).toEqual({
        loading: false,
        error: true,
      });
    });

    it('returns mercure info on GET_MERCURE_INFO', () => {
      expect(reducer(undefined, { type: GET_MERCURE_INFO, payload: mercureInfo })).toEqual({
        ...mercureInfo,
        loading: false,
        error: false,
      });
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
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: GET_MERCURE_INFO, payload: mercureInfo });
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
