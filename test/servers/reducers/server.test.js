import * as sinon from 'sinon';
import { values } from 'ramda';
import reduce, {
  _createServer,
  _deleteServer,
  _listServers,
  _createServers,
  FETCH_SERVERS,
} from '../../../src/servers/reducers/server';

describe('serverReducer', () => {
  const servers = {
    abc123: { id: 'abc123' },
    def456: { id: 'def456' },
  };
  const ServersServiceMock = {
    listServers: sinon.fake.returns(servers),
    createServer: sinon.fake(),
    deleteServer: sinon.fake(),
    createServers: sinon.fake(),
  };

  describe('reduce', () => {
    it('returns servers when action is FETCH_SERVERS', () =>
      expect(reduce({}, { type: FETCH_SERVERS, servers })).toEqual(servers));

    it('returns default when action is unknown', () =>
      expect(reduce({}, { type: 'unknown' })).toEqual({}));
  });

  describe('action creators', () => {
    beforeEach(() => {
      ServersServiceMock.listServers.resetHistory();
      ServersServiceMock.createServer.resetHistory();
      ServersServiceMock.deleteServer.resetHistory();
      ServersServiceMock.createServers.resetHistory();
    });

    describe('listServers', () => {
      it('fetches servers and returns them as part of the action', () => {
        const result = _listServers(ServersServiceMock);

        expect(result).toEqual({ type: FETCH_SERVERS, servers });
        expect(ServersServiceMock.listServers.callCount).toEqual(1);
        expect(ServersServiceMock.createServer.callCount).toEqual(0);
        expect(ServersServiceMock.deleteServer.callCount).toEqual(0);
        expect(ServersServiceMock.createServers.callCount).toEqual(0);
      });
    });

    describe('createServer', () => {
      it('adds new server and then fetches servers again', () => {
        const serverToCreate = { id: 'abc123' };
        const result = _createServer(ServersServiceMock, serverToCreate);

        expect(result).toEqual({ type: FETCH_SERVERS, servers });
        expect(ServersServiceMock.listServers.callCount).toEqual(1);
        expect(ServersServiceMock.createServer.callCount).toEqual(1);
        expect(ServersServiceMock.createServer.firstCall.calledWith(serverToCreate)).toEqual(true);
        expect(ServersServiceMock.deleteServer.callCount).toEqual(0);
        expect(ServersServiceMock.createServers.callCount).toEqual(0);
      });
    });

    describe('deleteServer', () => {
      it('deletes a server and then fetches servers again', () => {
        const serverToDelete = { id: 'abc123' };
        const result = _deleteServer(ServersServiceMock, serverToDelete);

        expect(result).toEqual({ type: FETCH_SERVERS, servers });
        expect(ServersServiceMock.listServers.callCount).toEqual(1);
        expect(ServersServiceMock.createServer.callCount).toEqual(0);
        expect(ServersServiceMock.createServers.callCount).toEqual(0);
        expect(ServersServiceMock.deleteServer.callCount).toEqual(1);
        expect(ServersServiceMock.deleteServer.firstCall.calledWith(serverToDelete)).toEqual(true);
      });
    });

    describe('createServer', () => {
      it('creates multiple servers and then fetches servers again', () => {
        const serversToCreate = values(servers);
        const result = _createServers(ServersServiceMock, serversToCreate);

        expect(result).toEqual({ type: FETCH_SERVERS, servers });
        expect(ServersServiceMock.listServers.callCount).toEqual(1);
        expect(ServersServiceMock.createServer.callCount).toEqual(0);
        expect(ServersServiceMock.createServers.callCount).toEqual(1);
        expect(ServersServiceMock.createServers.firstCall.calledWith(serversToCreate)).toEqual(true);
        expect(ServersServiceMock.deleteServer.callCount).toEqual(0);
      });
    });
  });
});
