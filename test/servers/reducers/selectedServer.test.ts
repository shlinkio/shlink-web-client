import type { ShlinkApiClient } from '@shlinkio/shlink-js-sdk';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ShlinkState } from '../../../src/container/types';
import type { NonReachableServer, NotFoundServer, RegularServer } from '../../../src/servers/data';
import {
  MAX_FALLBACK_VERSION,
  MIN_FALLBACK_VERSION,
  resetSelectedServer,
  selectedServerReducerCreator,
  selectServer as selectServerCreator,
} from '../../../src/servers/reducers/selectedServer';

describe('selectedServerReducer', () => {
  const dispatch = vi.fn();
  const health = vi.fn();
  const buildApiClient = vi.fn().mockReturnValue(fromPartial<ShlinkApiClient>({ health }));
  const selectServer = selectServerCreator(buildApiClient);
  const { reducer } = selectedServerReducerCreator(selectServer);

  describe('reducer', () => {
    it('returns default when action is RESET_SELECTED_SERVER', () =>
      expect(reducer(null, resetSelectedServer())).toBeNull());

    it('returns selected server when action is SELECT_SERVER', () => {
      const payload = fromPartial<RegularServer>({ id: 'abc123' });
      expect(reducer(null, selectServer.fulfilled(payload, '', ''))).toEqual(payload);
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
      const id = crypto.randomUUID();
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
      const id = crypto.randomUUID();
      const getState = createGetStateMock(id);
      const expectedSelectedServer = fromPartial<NonReachableServer>({ id, serverNotReachable: true });

      health.mockRejectedValue({});

      await selectServer(id)(dispatch, getState, {});

      expect(health).toHaveBeenCalled();
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({ payload: expectedSelectedServer }));
    });

    it('dispatches error when server is not found', async () => {
      const id = crypto.randomUUID();
      const getState = vi.fn(() => fromPartial<ShlinkState>({ servers: {} }));
      const expectedSelectedServer: NotFoundServer = { serverNotFound: true };

      await selectServer(id)(dispatch, getState, {});

      expect(getState).toHaveBeenCalled();
      expect(health).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenLastCalledWith(expect.objectContaining({ payload: expectedSelectedServer }));
    });
  });
});
