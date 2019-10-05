import reducer, {
  selectServer,
  resetSelectedServer,
  RESET_SELECTED_SERVER,
  SELECT_SERVER,
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
      health: jest.fn().mockResolvedValue({ version }),
    };
    const buildApiClient = jest.fn().mockResolvedValue(apiClientMock);

    beforeEach(() => {
      apiClientMock.health.mockClear();
      buildApiClient.mockClear();
    });

    afterEach(() => {
      ServersServiceMock.findServerById.mockClear();
    });

    it('dispatches proper actions', async () => {
      const dispatch = jest.fn();
      const expectedSelectedServer = {
        ...selectedServer,
        version,
      };

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
  });
});
