import * as sinon from 'sinon';
import reducer, {
  selectServer,
  resetSelectedServer,
  RESET_SELECTED_SERVER,
  SELECT_SERVER,
} from '../../../src/servers/reducers/selectedServer';
import { RESET_SHORT_URL_PARAMS } from '../../../src/short-urls/reducers/shortUrlsListParams';

describe('selectedServerReducer', () => {
  describe('reducer', () => {
    it('returns default when action is not handled', () =>
      expect(reducer(null, { type: 'unknown' })).toEqual(null));

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
      findServerById: sinon.fake.returns(selectedServer),
    };

    afterEach(() => {
      ServersServiceMock.findServerById.resetHistory();
    });

    it('dispatches proper actions', () => {
      const dispatch = sinon.spy();
      const expectedDispatchCalls = 2;

      selectServer(ServersServiceMock)(serverId)(dispatch);

      expect(dispatch.callCount).toEqual(expectedDispatchCalls);
      expect(dispatch.firstCall.calledWith({ type: RESET_SHORT_URL_PARAMS })).toEqual(true);
      expect(dispatch.secondCall.calledWith({
        type: SELECT_SERVER,
        selectedServer,
      })).toEqual(true);
    });

    it('invokes dependencies', () => {
      selectServer(ServersServiceMock)(serverId)(() => {});

      expect(ServersServiceMock.findServerById.callCount).toEqual(1);
    });
  });
});
