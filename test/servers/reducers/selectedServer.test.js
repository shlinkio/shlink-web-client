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
    const ServersServiceMock = {
      findServerById: jest.fn(() => selectedServer),
    };

    afterEach(() => {
      ServersServiceMock.findServerById.mockClear();
    });

    it('dispatches proper actions', () => {
      const dispatch = jest.fn();
      const expectedDispatchCalls = 2;

      selectServer(ServersServiceMock)(serverId)(dispatch);

      const [ firstCallArgs, secondCallArgs ] = dispatch.mock.calls;

      expect(dispatch).toHaveBeenCalledTimes(expectedDispatchCalls);
      expect(firstCallArgs).toEqual([{ type: RESET_SHORT_URL_PARAMS }]);
      expect(secondCallArgs).toEqual([
        {
          type: SELECT_SERVER,
          selectedServer,
        },
      ]);
    });

    it('invokes dependencies', () => {
      selectServer(ServersServiceMock)(serverId)(() => {});

      expect(ServersServiceMock.findServerById).toHaveBeenCalledTimes(1);
    });
  });
});
