import { v4 as uuid } from 'uuid';
import { Mock } from 'ts-mockery';
import reducer, {
  selectServer as selectServerCreator,
  resetSelectedServer,
  MAX_FALLBACK_VERSION,
  MIN_FALLBACK_VERSION,
} from '../../../src/servers/reducers/selectedServer';
import { ShlinkState } from '../../../src/container/types';
import { NonReachableServer, NotFoundServer, RegularServer } from '../../../src/servers/data';
import { ShlinkApiClient } from '../../../src/api/services/ShlinkApiClient';

describe('selectedServerReducer', () => {
  const health = jest.fn();
  const buildApiClient = jest.fn().mockReturnValue(Mock.of<ShlinkApiClient>({ health }));
  const selectServer = selectServerCreator(buildApiClient);

  afterEach(jest.clearAllMocks);

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
    const selectedServer = {
      id: 'abc123',
    };
    const version = '1.19.0';
    const createGetStateMock = (id: string) => jest.fn().mockReturnValue({ servers: { [id]: selectedServer } });
    const dispatch = jest.fn();

    it.each([
      [version, version, `v${version}`],
      ['latest', MAX_FALLBACK_VERSION, 'latest'],
      ['%invalid_semver%', MIN_FALLBACK_VERSION, '%invalid_semver%'],
    ])('dispatches proper actions', async (serverVersion, expectedVersion, expectedPrintableVersion) => {
      const id = uuid();
      const getState = createGetStateMock(id);
      const expectedSelectedServer = {
        ...selectedServer,
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

      await selectServer(id)(jest.fn(), getState, {});

      expect(getState).toHaveBeenCalledTimes(1);
      expect(buildApiClient).toHaveBeenCalledTimes(1);
    });

    it('dispatches error when health endpoint fails', async () => {
      const id = uuid();
      const getState = createGetStateMock(id);
      const expectedSelectedServer = Mock.of<NonReachableServer>({ ...selectedServer, serverNotReachable: true });

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
      const getState = jest.fn(() => Mock.of<ShlinkState>({ servers: {} }));
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
});
