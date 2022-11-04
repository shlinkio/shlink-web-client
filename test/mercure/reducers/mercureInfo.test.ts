import { Mock } from 'ts-mockery';
import { mercureInfoReducerCreator } from '../../../src/mercure/reducers/mercureInfo';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import { GetState } from '../../../src/container/types';

describe('mercureInfoReducer', () => {
  const mercureInfo = {
    mercureHubUrl: 'http://example.com/.well-known/mercure',
    token: 'abc.123.def',
  };
  const getMercureInfo = jest.fn();
  const buildShlinkApiClient = () => Mock.of<ShlinkApiClient>({ mercureInfo: getMercureInfo });
  const { loadMercureInfo, reducer } = mercureInfoReducerCreator(buildShlinkApiClient);

  beforeEach(jest.resetAllMocks);

  describe('reducer', () => {
    it('returns loading on GET_MERCURE_INFO_START', () => {
      expect(reducer(undefined, { type: loadMercureInfo.pending.toString() })).toEqual({
        loading: true,
        error: false,
      });
    });

    it('returns error on GET_MERCURE_INFO_ERROR', () => {
      expect(reducer(undefined, { type: loadMercureInfo.rejected.toString() })).toEqual({
        loading: false,
        error: true,
      });
    });

    it('returns mercure info on GET_MERCURE_INFO', () => {
      expect(reducer(undefined, { type: loadMercureInfo.fulfilled.toString(), payload: mercureInfo })).toEqual(
        expect.objectContaining({ ...mercureInfo, loading: false, error: false }),
      );
    });
  });

  describe('loadMercureInfo', () => {
    const dispatch = jest.fn();
    const createGetStateMock = (enabled: boolean): GetState => jest.fn().mockReturnValue({
      settings: {
        realTimeUpdates: { enabled },
      },
    });

    it('dispatches error when real time updates are disabled', async () => {
      getMercureInfo.mockResolvedValue(mercureInfo);
      const getState = createGetStateMock(false);

      await loadMercureInfo()(dispatch, getState, {});

      expect(getMercureInfo).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: loadMercureInfo.pending.toString(),
      }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: loadMercureInfo.rejected.toString(),
      }));
    });

    it('calls API on success', async () => {
      getMercureInfo.mockResolvedValue(mercureInfo);
      const getState = createGetStateMock(true);

      await loadMercureInfo()(dispatch, getState, {});

      expect(getMercureInfo).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: loadMercureInfo.pending.toString(),
      }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: loadMercureInfo.fulfilled.toString(),
        payload: mercureInfo,
      }));
    });

    it('throws error on failure', async () => {
      const error = 'Error';
      const getState = createGetStateMock(true);

      getMercureInfo.mockRejectedValue(error);

      await loadMercureInfo()(dispatch, getState, {});

      expect(getMercureInfo).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: loadMercureInfo.pending.toString(),
      }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({
        type: loadMercureInfo.rejected.toString(),
      }));
    });
  });
});
