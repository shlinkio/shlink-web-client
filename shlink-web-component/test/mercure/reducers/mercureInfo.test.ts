import { fromPartial } from '@total-typescript/shoehorn';
import type { ShlinkApiClient } from '../../../../src/api/services/ShlinkApiClient';
import type { GetState } from '../../../../src/container/types';
import { mercureInfoReducerCreator } from '../../../src/mercure/reducers/mercureInfo';

describe('mercureInfoReducer', () => {
  const mercureInfo = {
    mercureHubUrl: 'http://example.com/.well-known/mercure',
    token: 'abc.123.def',
  };
  const getMercureInfo = vi.fn();
  const buildShlinkApiClient = () => fromPartial<ShlinkApiClient>({ mercureInfo: getMercureInfo });
  const { loadMercureInfo, reducer } = mercureInfoReducerCreator(buildShlinkApiClient);

  describe('reducer', () => {
    it('returns loading on GET_MERCURE_INFO_START', () => {
      expect(reducer(undefined, loadMercureInfo.pending(''))).toEqual({
        loading: true,
        error: false,
      });
    });

    it('returns error on GET_MERCURE_INFO_ERROR', () => {
      expect(reducer(undefined, loadMercureInfo.rejected(null, ''))).toEqual({
        loading: false,
        error: true,
      });
    });

    it('returns mercure info on GET_MERCURE_INFO', () => {
      expect(reducer(undefined, loadMercureInfo.fulfilled(mercureInfo, ''))).toEqual(
        expect.objectContaining({ ...mercureInfo, loading: false, error: false }),
      );
    });
  });

  describe('loadMercureInfo', () => {
    const dispatch = vi.fn();
    const createGetStateMock = (enabled: boolean): GetState => vi.fn().mockReturnValue({
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
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({
        error: new Error('Real time updates not enabled'),
      }));
    });

    it('calls API on success', async () => {
      getMercureInfo.mockResolvedValue(mercureInfo);
      const getState = createGetStateMock(true);

      await loadMercureInfo()(dispatch, getState, {});

      expect(getMercureInfo).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({ payload: mercureInfo }));
    });
  });
});
