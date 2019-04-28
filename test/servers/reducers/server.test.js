import { values } from 'ramda';
import reducer, {
  createServer,
  deleteServer,
  listServers,
  createServers,
  FETCH_SERVERS, FETCH_SERVERS_START,
} from '../../../src/servers/reducers/server';

describe('serverReducer', () => {
  const list = {
    abc123: { id: 'abc123' },
    def456: { id: 'def456' },
  };
  const expectedFetchServersResult = { type: FETCH_SERVERS, list };
  const ServersServiceMock = {
    listServers: jest.fn(() => list),
    createServer: jest.fn(),
    deleteServer: jest.fn(),
    createServers: jest.fn(),
  };

  describe('reducer', () => {
    it('returns servers when action is FETCH_SERVERS', () =>
      expect(reducer({}, { type: FETCH_SERVERS, list })).toEqual({ loading: false, list }));
  });

  describe('action creators', () => {
    beforeEach(() => {
      ServersServiceMock.listServers.mockClear();
      ServersServiceMock.createServer.mockReset();
      ServersServiceMock.deleteServer.mockReset();
      ServersServiceMock.createServers.mockReset();
    });

    describe('listServers', () => {
      const axios = { get: jest.fn().mockResolvedValue({ data: [] }) };
      const dispatch = jest.fn();

      beforeEach(() => {
        axios.get.mockClear();
        dispatch.mockReset();
      });

      it('fetches servers from local storage when found', async () => {
        await listServers(ServersServiceMock, axios)()(dispatch);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(1, { type: FETCH_SERVERS_START });
        expect(dispatch).toHaveBeenNthCalledWith(2, expectedFetchServersResult);
        expect(ServersServiceMock.listServers).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.createServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.deleteServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServers).not.toHaveBeenCalled();
        expect(axios.get).not.toHaveBeenCalled();
      });

      it('tries to fetch servers from remote when not found locally', async () => {
        const NoListServersServiceMock = { ...ServersServiceMock, listServers: jest.fn(() => ({})) };

        await listServers(NoListServersServiceMock, axios)()(dispatch);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(1, { type: FETCH_SERVERS_START });
        expect(dispatch).toHaveBeenNthCalledWith(2, { type: FETCH_SERVERS, list: {} });
        expect(NoListServersServiceMock.listServers).toHaveBeenCalledTimes(1);
        expect(NoListServersServiceMock.createServer).not.toHaveBeenCalled();
        expect(NoListServersServiceMock.deleteServer).not.toHaveBeenCalled();
        expect(NoListServersServiceMock.createServers).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledTimes(1);
      });
    });

    describe('createServer', () => {
      it('adds new server and then fetches servers again', () => {
        const serverToCreate = { id: 'abc123' };
        const result = createServer(ServersServiceMock, () => expectedFetchServersResult)(serverToCreate);

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.createServer).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.createServer).toHaveBeenCalledWith(serverToCreate);
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
        expect(ServersServiceMock.deleteServer).toHaveBeenCalledWith(serverToDelete);
      });
    });

    describe('createServer', () => {
      it('creates multiple servers and then fetches servers again', () => {
        const serversToCreate = values(list);
        const result = createServers(ServersServiceMock, () => expectedFetchServersResult)(serversToCreate);

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.listServers).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServers).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.createServers).toHaveBeenCalledWith(serversToCreate);
        expect(ServersServiceMock.deleteServer).not.toHaveBeenCalled();
      });
    });
  });
});
