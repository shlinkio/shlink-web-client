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
    listServers: jest.fn(() => payload),
    createServer: jest.fn(),
    deleteServer: jest.fn(),
    createServers: jest.fn(),
  };

  describe('reducer', () => {
    it('returns servers when action is FETCH_SERVERS', () =>
      expect(reducer({}, { type: FETCH_SERVERS, payload })).toEqual(payload));
  });

  describe('action creators', () => {
    beforeEach(() => {
      ServersServiceMock.listServers.mockClear();
      ServersServiceMock.createServer.mockReset();
      ServersServiceMock.deleteServer.mockReset();
      ServersServiceMock.createServers.mockReset();
    });

    describe('listServers', () => {
      it('fetches servers and returns them as part of the action', () => {
        const result = listServers(ServersServiceMock)();

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.listServers).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.createServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.deleteServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServers).not.toHaveBeenCalled();
      });
    });

    describe('createServer', () => {
      it('adds new server and then fetches servers again', () => {
        const serverToCreate = { id: 'abc123' };
        const result = createServer(ServersServiceMock, () => expectedFetchServersResult)(serverToCreate);

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.createServer).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.createServer.mock.calls[0]).toEqual([ serverToCreate ]);
        expect(ServersServiceMock.listServers).not.toHaveBeenCalled();
        expect(ServersServiceMock.deleteServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServers).not.toHaveBeenCalled();
      });
    });

    describe('deleteServer', () => {
      it('deletes a server and then fetches servers again', () => {
        const serverToDelete = { id: 'abc123' };
        const result = deleteServer(ServersServiceMock, () => expectedFetchServersResult)(serverToDelete);

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.listServers).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServers).not.toHaveBeenCalled();
        expect(ServersServiceMock.deleteServer).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.deleteServer.mock.calls[0]).toEqual([ serverToDelete ]);
      });
    });

    describe('createServer', () => {
      it('creates multiple servers and then fetches servers again', () => {
        const serversToCreate = values(payload);
        const result = createServers(ServersServiceMock, () => expectedFetchServersResult)(serversToCreate);

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.listServers).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServers).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.createServers.mock.calls[0]).toEqual([ serversToCreate ]);
        expect(ServersServiceMock.deleteServer).not.toHaveBeenCalled();
      });
    });
  });
});
