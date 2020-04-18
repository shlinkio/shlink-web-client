import { v4 as uuid } from 'uuid';
import reducer, {
  selectServer,
  resetSelectedServer,
  RESET_SELECTED_SERVER,
  SELECT_SERVER,
  MAX_FALLBACK_VERSION,
  MIN_FALLBACK_VERSION,
} from '../../../src/servers/reducers/selectedServer';
import { RESET_SHORT_URL_PARAMS } from '../../../src/short-urls/reducers/shortUrlsListParams';

describe('selectedServerReducer', () => {
  describe('reducer', () => {
    it('returns default when action is RESET_SELECTED_SERVER', () =>
      expect(reducer(null, { type: RESET_SELECTED_SERVER })).toEqual(null));

    it('returns selected server when action is SELECT_SERVER', () => {
      const selectedServer = { id: 'abc123' };

      expect(reducer(null, { type: SELECT_SERVER, selectedServer })).toEqual(selectedServer);
    });
  });

  describe('resetSelectedServer', () => {
    it('returns proper action', () => {
      expect(resetSelectedServer()).toEqual({ type: RESET_SELECTED_SERVER });
    });
  });

  describe('selectServer', () => {
    const selectedServer = {
      id: 'abc123',
    };
    const version = '1.19.0';
    const ServersServiceMock = {
      findServerById: jest.fn(() => selectedServer),
    };
    const apiClientMock = {
      health: jest.fn(),
    };
    const buildApiClient = jest.fn().mockReturnValue(apiClientMock);
    const dispatch = jest.fn();
    const loadMercureInfo = jest.fn();

    afterEach(jest.clearAllMocks);

    it.each([
      [ version, version, `v${version}` ],
      [ 'latest', MAX_FALLBACK_VERSION, 'latest' ],
      [ '%invalid_semver%', MIN_FALLBACK_VERSION, '%invalid_semver%' ],
    ])('dispatches proper actions', async (serverVersion, expectedVersion, expectedPrintableVersion) => {
      const expectedSelectedServer = {
        ...selectedServer,
        version: expectedVersion,
        printableVersion: expectedPrintableVersion,
      };

      apiClientMock.health.mockResolvedValue({ version: serverVersion });

      await selectServer(ServersServiceMock, buildApiClient, loadMercureInfo)(uuid())(dispatch);

      expect(dispatch).toHaveBeenCalledTimes(4);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: RESET_SELECTED_SERVER });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: RESET_SHORT_URL_PARAMS });
      expect(dispatch).toHaveBeenNthCalledWith(3, { type: SELECT_SERVER, selectedServer: expectedSelectedServer });
      expect(loadMercureInfo).toHaveBeenCalledTimes(1);
    });

    it('invokes dependencies', async () => {
      await selectServer(ServersServiceMock, buildApiClient, loadMercureInfo)(uuid())(() => {});

      expect(ServersServiceMock.findServerById).toHaveBeenCalledTimes(1);
      expect(buildApiClient).toHaveBeenCalledTimes(1);
    });

    it('dispatches error when health endpoint fails', async () => {
      const expectedSelectedServer = { ...selectedServer, serverNotReachable: true };

      apiClientMock.health.mockRejectedValue({});

      await selectServer(ServersServiceMock, buildApiClient, loadMercureInfo)(uuid())(dispatch);

      expect(apiClientMock.health).toHaveBeenCalled();
      expect(dispatch).toHaveBeenNthCalledWith(3, { type: SELECT_SERVER, selectedServer: expectedSelectedServer });
      expect(loadMercureInfo).not.toHaveBeenCalled();
    });

    it('dispatches error when server is not found', async () => {
      const expectedSelectedServer = { serverNotFound: true };

      ServersServiceMock.findServerById.mockReturnValue(undefined);

      await selectServer(ServersServiceMock, buildApiClient, loadMercureInfo)(uuid())(dispatch);

      expect(ServersServiceMock.findServerById).toHaveBeenCalled();
      expect(apiClientMock.health).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenNthCalledWith(3, { type: SELECT_SERVER, selectedServer: expectedSelectedServer });
      expect(loadMercureInfo).not.toHaveBeenCalled();
    });
  });
});
