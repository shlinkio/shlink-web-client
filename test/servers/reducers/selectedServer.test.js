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
    const serverId = 'abc123';
    const selectedServer = {
      id: serverId,
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

      await selectServer(ServersServiceMock, buildApiClient)(serverId)(dispatch);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, { type: RESET_SHORT_URL_PARAMS });
      expect(dispatch).toHaveBeenNthCalledWith(2, { type: SELECT_SERVER, selectedServer: expectedSelectedServer });
    });

    it('invokes dependencies', async () => {
      await selectServer(ServersServiceMock, buildApiClient)(serverId)(() => {});

      expect(ServersServiceMock.findServerById).toHaveBeenCalledTimes(1);
      expect(buildApiClient).toHaveBeenCalledTimes(1);
    });

    it('falls back to min version when health endpoint fails', async () => {
      const expectedSelectedServer = {
        ...selectedServer,
        version: MIN_FALLBACK_VERSION,
      };

      apiClientMock.health.mockRejectedValue({});

      await selectServer(ServersServiceMock, buildApiClient)(serverId)(dispatch);

      expect(dispatch).toHaveBeenNthCalledWith(2, { type: SELECT_SERVER, selectedServer: expectedSelectedServer });
    });
  });
});
