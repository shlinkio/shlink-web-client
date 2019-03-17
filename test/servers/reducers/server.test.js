import * as sinon from 'sinon';
import { values } from 'ramda';
import reducer, {
  createServer,
  deleteServer,
  listServers,
  createServers,
  FETCH_SERVERS,
} from '../../../src/servers/reducers/server';

describe('serverReducer', () => {
  const payload = {
    abc123: { id: 'abc123' },
    def456: { id: 'def456' },
  };
  const expectedFetchServersResult = { type: FETCH_SERVERS, payload };
  const ServersServiceMock = {
    listServers: sinon.fake.returns(payload),
    createServer: sinon.fake(),
    deleteServer: sinon.fake(),
    createServers: sinon.fake(),
  };

  describe('reducer', () => {
    it('returns servers when action is FETCH_SERVERS', () =>
      expect(reducer({}, { type: FETCH_SERVERS, payload })).toEqual(payload));
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
        const result = listServers(ServersServiceMock)();

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.listServers.calledOnce).toEqual(true);
        expect(ServersServiceMock.createServer.called).toEqual(false);
        expect(ServersServiceMock.deleteServer.called).toEqual(false);
        expect(ServersServiceMock.createServers.called).toEqual(false);
      });
    });

    describe('createServer', () => {
      it('adds new server and then fetches servers again', () => {
        const serverToCreate = { id: 'abc123' };
        const result = createServer(ServersServiceMock, () => expectedFetchServersResult)(serverToCreate);

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.createServer.calledOnce).toEqual(true);
        expect(ServersServiceMock.createServer.firstCall.calledWith(serverToCreate)).toEqual(true);
        expect(ServersServiceMock.listServers.called).toEqual(false);
        expect(ServersServiceMock.deleteServer.called).toEqual(false);
        expect(ServersServiceMock.createServers.called).toEqual(false);
      });
    });

    describe('deleteServer', () => {
      it('deletes a server and then fetches servers again', () => {
        const serverToDelete = { id: 'abc123' };
        const result = deleteServer(ServersServiceMock, () => expectedFetchServersResult)(serverToDelete);

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.listServers.called).toEqual(false);
        expect(ServersServiceMock.createServer.called).toEqual(false);
        expect(ServersServiceMock.createServers.called).toEqual(false);
        expect(ServersServiceMock.deleteServer.calledOnce).toEqual(true);
        expect(ServersServiceMock.deleteServer.firstCall.calledWith(serverToDelete)).toEqual(true);
      });
    });

    describe('createServer', () => {
      it('creates multiple servers and then fetches servers again', () => {
        const serversToCreate = values(payload);
        const result = createServers(ServersServiceMock, () => expectedFetchServersResult)(serversToCreate);

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.listServers.called).toEqual(false);
        expect(ServersServiceMock.createServer.called).toEqual(false);
        expect(ServersServiceMock.createServers.calledOnce).toEqual(true);
        expect(ServersServiceMock.createServers.firstCall.calledWith(serversToCreate)).toEqual(true);
        expect(ServersServiceMock.deleteServer.called).toEqual(false);
      });
    });
  });
});
