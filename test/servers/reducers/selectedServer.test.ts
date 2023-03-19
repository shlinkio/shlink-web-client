import { Mock } from 'ts-mockery';
import { v4 as uuid } from 'uuid';
import type { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';
import type { ShlinkState } from '../../../src/container/types';
import type { NonReachableServer, NotFoundServer, ReachableServer, RegularServer } from '../../../src/servers/data';
import {
  MAX_FALLBACK_VERSION,
  MIN_FALLBACK_VERSION,
  resetSelectedServer,
  selectedServerReducerCreator,
  selectServer as selectServerCreator,
  selectServerListener,
} from '../../../src/servers/reducers/selectedServer';

describe('selectedServerReducer', () => {
  const dispatch = jest.fn();
  const health = jest.fn();
  const buildApiClient = jest.fn().mockReturnValue(Mock.of<ShlinkApiClient>({ health }));
  const selectServer = selectServerCreator(buildApiClient);
  const { reducer } = selectedServerReducerCreator(selectServer);

  afterEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns default when action is RESET_SELECTED_SERVER', () =>
      expect(reducer(null, resetSelectedServer())).toBeNull());

    it('returns selected server when action is SELECT_SERVER', () => {
      const payload = Mock.of<RegularServer>({ id: 'abc123' });

      expect(reducer(null, selectServer.fulfilled(payload, '', ''))).toEqual(payload);
    });
  });

  describe('selectServer', () => {
    const version = '1.19.0';
    const createGetStateMock = (id: string) => jest.fn().mockReturnValue({
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

      expect(getState).toHaveBeenCalledTimes(1);
      expect(buildApiClient).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(3); // "Pending", "reset" and "fulfilled"
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({ payload: expectedSelectedServer }));
    });

    it('dispatches error when health endpoint fails', async () => {
      const id = uuid();
      const getState = createGetStateMock(id);
      const expectedSelectedServer = Mock.of<NonReachableServer>({ id, serverNotReachable: true });

      health.mockRejectedValue({});

      await selectServer(id)(dispatch, getState, {});

      expect(health).toHaveBeenCalled();
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({ payload: expectedSelectedServer }));
    });

    it('dispatches error when server is not found', async () => {
      const id = uuid();
      const getState = jest.fn(() => Mock.of<ShlinkState>({ servers: {} }));
      const expectedSelectedServer: NotFoundServer = { serverNotFound: true };

      await selectServer(id)(dispatch, getState, {});

      expect(getState).toHaveBeenCalled();
      expect(health).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({ payload: expectedSelectedServer }));
    });
  });

  describe('selectServerListener', () => {
    const getState = jest.fn(() => ({}));
    const loadMercureInfo = jest.fn();
    const { middleware } = selectServerListener(selectServer, loadMercureInfo);

    it.each([
      [Mock.of<ReachableServer>({ version: '1.2.3' }), 1],
      [Mock.of<NotFoundServer>({ serverNotFound: true }), 0],
      [Mock.of<NonReachableServer>({ serverNotReachable: true }), 0],
    ])('dispatches loadMercureInfo when provided server is reachable', (payload, expectedCalls) => {
      middleware({ dispatch, getState })(jest.fn())({
        payload,
        type: selectServer.fulfilled.toString(),
      });

      expect(dispatch).toHaveBeenCalledTimes(expectedCalls);
      expect(loadMercureInfo).toHaveBeenCalledTimes(expectedCalls);
    });

    it('does not dispatch loadMercureInfo when action is not of the proper type', () => {
      middleware({ dispatch, getState })(jest.fn())({
        payload: Mock.of<ReachableServer>({ version: '1.2.3' }),
        type: 'something_else',
      });

      expect(dispatch).not.toHaveBeenCalled();
      expect(loadMercureInfo).not.toHaveBeenCalled();
    });
  });
});
