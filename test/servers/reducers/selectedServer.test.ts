import { v4 as uuid } from 'uuid';
import { Mock } from 'ts-mockery';
import {
  selectServer as selectServerCreator,
  resetSelectedServer,
  selectedServerReducerCreator,
  selectServerListener,
  MAX_FALLBACK_VERSION,
  MIN_FALLBACK_VERSION,
} from '../../../src/servers/reducers/selectedServer';
import { ShlinkState } from '../../../src/container/types';
import { NonReachableServer, NotFoundServer, ReachableServer, RegularServer } from '../../../src/servers/data';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';

describe('selectedServerReducer', () => {
  const dispatch = vi.fn();
  const health = vi.fn();
  const buildApiClient = vi.fn().mockReturnValue(Mock.of<ShlinkApiClient>({ health }));
  const selectServer = selectServerCreator(buildApiClient);
  const { reducer } = selectedServerReducerCreator(selectServer);

  afterEach(vi.clearAllMocks);

  describe('reducer', () => {
    it('returns default when action is RESET_SELECTED_SERVER', () =>
      expect(reducer(null, { type: resetSelectedServer.toString(), payload: null })).toBeNull());

    it('returns selected server when action is SELECT_SERVER', () => {
      const payload = Mock.of<RegularServer>({ id: 'abc123' });

      expect(reducer(null, { type: selectServer.fulfilled.toString(), payload })).toEqual(payload);
    });
  });

  describe('resetSelectedServer', () => {
    it('returns proper action', () => {
      expect(resetSelectedServer()).toEqual({ type: resetSelectedServer.toString() });
    });
  });

  describe('selectServer', () => {
    const version = '1.19.0';
    const createGetStateMock = (id: string) => vi.fn().mockReturnValue({
      servers: {
        [id]: { id },
      },
    });

    it.each([
      [version, version, `v${version}`],
      ['latest', MAX_FALLBACK_VERSION, 'latest'],
      ['%invalid_semver%', MIN_FALLBACK_VERSION, '%invalid_semver%'],
    ])('dispatches proper actions', async (serverVersion, expectedVersion, expectedPrintableVersion) => {
      const id = uuid();
      const getState = createGetStateMock(id);
      const expectedSelectedServer = {
        id,
        version: expectedVersion,
        printableVersion: expectedPrintableVersion,
      };

      health.mockResolvedValue({ version: serverVersion });

      await selectServer(id)(dispatch, getState, {});

      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({ type: selectServer.pending.toString() }));
      expect(dispatch).toHaveBeenNthCalledWith(2, expect.objectContaining({ type: resetSelectedServer.toString() }));
      expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
        type: selectServer.fulfilled.toString(),
        payload: expectedSelectedServer,
      }));
    });

    it('invokes dependencies', async () => {
      const id = uuid();
      const getState = createGetStateMock(id);

      await selectServer(id)(vi.fn(), getState, {});

      expect(getState).toHaveBeenCalledTimes(1);
      expect(buildApiClient).toHaveBeenCalledTimes(1);
    });

    it('dispatches error when health endpoint fails', async () => {
      const id = uuid();
      const getState = createGetStateMock(id);
      const expectedSelectedServer = Mock.of<NonReachableServer>({ id, serverNotReachable: true });

      health.mockRejectedValue({});

      await selectServer(id)(dispatch, getState, {});

      expect(health).toHaveBeenCalled();
      expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
        type: selectServer.fulfilled.toString(),
        payload: expectedSelectedServer,
      }));
    });

    it('dispatches error when server is not found', async () => {
      const id = uuid();
      const getState = vi.fn(() => Mock.of<ShlinkState>({ servers: {} }));
      const expectedSelectedServer: NotFoundServer = { serverNotFound: true };

      await selectServer(id)(dispatch, getState, {});

      expect(getState).toHaveBeenCalled();
      expect(health).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenNthCalledWith(3, expect.objectContaining({
        type: selectServer.fulfilled.toString(),
        payload: expectedSelectedServer,
      }));
    });
  });

  describe('selectServerListener', () => {
    const getState = vi.fn(() => ({}));
    const loadMercureInfo = vi.fn();
    const { middleware } = selectServerListener(selectServer, loadMercureInfo);

    it.each([
      [Mock.of<ReachableServer>({ version: '1.2.3' }), 1],
      [Mock.of<NotFoundServer>({ serverNotFound: true }), 0],
      [Mock.of<NonReachableServer>({ serverNotReachable: true }), 0],
    ])('dispatches loadMercureInfo when provided server is reachable', (payload, expectedCalls) => {
      middleware({ dispatch, getState })(vi.fn())({
        payload,
        type: selectServer.fulfilled.toString(),
      });

      expect(dispatch).toHaveBeenCalledTimes(expectedCalls);
      expect(loadMercureInfo).toHaveBeenCalledTimes(expectedCalls);
    });

    it('does not dispatch loadMercureInfo when action is not of the proper type', () => {
      middleware({ dispatch, getState })(vi.fn())({
        payload: Mock.of<ReachableServer>({ version: '1.2.3' }),
        type: 'something_else',
      });

      expect(dispatch).not.toHaveBeenCalled();
      expect(loadMercureInfo).not.toHaveBeenCalled();
    });
  });
});
