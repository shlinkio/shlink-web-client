import reduce, {
  _createServer,
  _deleteServer,
  _listServers,
  CREATE_SERVER,
  DELETE_SERVER,
  FETCH_SERVERS,
} from '../../../src/servers/reducers/server';
import * as sinon from 'sinon';

describe('serverReducer', () => {
  const servers = {
    abc123: { id: 'abc123' },
    def456: { id: 'def456' }
  };
  const ServersServiceMock = {
    listServers: sinon.fake.returns(servers),
    createServer: sinon.fake(),
    deleteServer: sinon.fake(),
  };

  describe('reduce', () => {
    it('returns servers when action is FETCH_SERVERS', () =>
      expect(reduce({}, { type: FETCH_SERVERS, servers })).toEqual(servers)
    );

    it('returns servers when action is DELETE_SERVER', () =>
      expect(reduce({}, { type: DELETE_SERVER, servers })).toEqual(servers)
    );

    it('adds server to list when action is CREATE_SERVER', () => {
      const server = { id: 'abc123' };
      expect(reduce({}, { type: CREATE_SERVER, server })).toEqual({
        [server.id]: server
      })
    });

    it('returns default when action is unknown', () =>
      expect(reduce({}, { type: 'unknown' })).toEqual({})
    );
  });

  describe('action creators', () => {
    beforeEach(() => {
      ServersServiceMock.listServers.resetHistory();
      ServersServiceMock.createServer.resetHistory();
      ServersServiceMock.deleteServer.resetHistory();
    });

    describe('listServers', () => {
      it('fetches servers and returns them as part of the action', () => {
        const result = _listServers(ServersServiceMock);

        expect(result).toEqual({ type: FETCH_SERVERS, servers });
        expect(ServersServiceMock.listServers.callCount).toEqual(1);
        expect(ServersServiceMock.createServer.callCount).toEqual(0);
        expect(ServersServiceMock.deleteServer.callCount).toEqual(0);
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
      });
    });

    describe('deleteServer', () => {
      it('deletes a server and then fetches servers again', () => {
        const serverToDelete = { id: 'abc123' };
        const result = _deleteServer(ServersServiceMock, serverToDelete);

        expect(result).toEqual({ type: FETCH_SERVERS, servers });
        expect(ServersServiceMock.listServers.callCount).toEqual(1);
        expect(ServersServiceMock.createServer.callCount).toEqual(0);
        expect(ServersServiceMock.deleteServer.callCount).toEqual(1);
        expect(ServersServiceMock.deleteServer.firstCall.calledWith(serverToDelete)).toEqual(true);
      });
    });
  });
});
