import { values } from 'ramda';
import reducer, {
  createServer,
  deleteServer,
  listServers,
  createServers,
  editServer,
  FETCH_SERVERS,
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
    editServer: jest.fn(),
    deleteServer: jest.fn(),
    createServers: jest.fn(),
  };

  afterEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns servers when action is FETCH_SERVERS', () =>
      expect(reducer({}, { type: FETCH_SERVERS, list })).toEqual(list));
  });

  describe('action creators', () => {
    describe('listServers', () => {
      const axios = { get: jest.fn() };
      const dispatch = jest.fn();
      const NoListServersServiceMock = { ...ServersServiceMock, listServers: jest.fn(() => ({})) };

      it('fetches servers from local storage when found', async () => {
        await listServers(ServersServiceMock, axios)()(dispatch);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(1, expectedFetchServersResult);
        expect(ServersServiceMock.listServers).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.createServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.editServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.deleteServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServers).not.toHaveBeenCalled();
        expect(axios.get).not.toHaveBeenCalled();
      });

      it.each([
        [
          Promise.resolve({
            data: [
              {
                id: '111',
                name: 'acel.me from servers.json',
                url: 'https://acel.me',
                apiKey: '07fb8a96-8059-4094-a24c-80a7d5e7e9b0',
              },
              {
                id: '222',
                name: 'Local from servers.json',
                url: 'http://localhost:8000',
                apiKey: '7a531c75-134e-4d5c-86e0-a71b7167b57a',
              },
            ],
          }),
          {
            111: {
              id: '111',
              name: 'acel.me from servers.json',
              url: 'https://acel.me',
              apiKey: '07fb8a96-8059-4094-a24c-80a7d5e7e9b0',
            },
            222: {
              id: '222',
              name: 'Local from servers.json',
              url: 'http://localhost:8000',
              apiKey: '7a531c75-134e-4d5c-86e0-a71b7167b57a',
            },
          },
        ],
        [ Promise.resolve('<html></html>'), {}],
        [ Promise.reject({}), {}],
      ])('tries to fetch servers from remote when not found locally', async (mockedValue, expectedList) => {
        axios.get.mockReturnValue(mockedValue);

        await listServers(NoListServersServiceMock, axios)()(dispatch);

        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenNthCalledWith(1, { type: FETCH_SERVERS, list: expectedList });
        expect(NoListServersServiceMock.listServers).toHaveBeenCalledTimes(1);
        expect(NoListServersServiceMock.createServer).not.toHaveBeenCalled();
        expect(NoListServersServiceMock.editServer).not.toHaveBeenCalled();
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
        expect(ServersServiceMock.listServers).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServer).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.createServer).toHaveBeenCalledWith(serverToCreate);
        expect(ServersServiceMock.editServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.deleteServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServers).not.toHaveBeenCalled();
      });
    });

    describe('editServer', () => {
      it('edits existing server and then fetches servers again', () => {
        const serverToEdit = { name: 'edited' };
        const result = editServer(ServersServiceMock, () => expectedFetchServersResult)('123', serverToEdit);

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.listServers).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.editServer).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.editServer).toHaveBeenCalledWith('123', serverToEdit);
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
        expect(ServersServiceMock.editServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.deleteServer).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.deleteServer).toHaveBeenCalledWith(serverToDelete);
      });
    });

    describe('createServers', () => {
      it('creates multiple servers and then fetches servers again', () => {
        const serversToCreate = values(list);
        const result = createServers(ServersServiceMock, () => expectedFetchServersResult)(serversToCreate);

        expect(result).toEqual(expectedFetchServersResult);
        expect(ServersServiceMock.listServers).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.editServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.deleteServer).not.toHaveBeenCalled();
        expect(ServersServiceMock.createServers).toHaveBeenCalledTimes(1);
        expect(ServersServiceMock.createServers).toHaveBeenCalledWith(serversToCreate);
      });
    });
  });
});
