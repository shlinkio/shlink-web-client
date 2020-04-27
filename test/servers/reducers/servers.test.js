import { values } from 'ramda';
import reducer, {
  createServer,
  deleteServer,
  listServers,
  createServers,
  editServer,
  LIST_SERVERS,
  EDIT_SERVER,
  DELETE_SERVER,
  CREATE_SERVERS,
} from '../../../src/servers/reducers/servers';

describe('serverReducer', () => {
  const list = {
    abc123: { id: 'abc123' },
    def456: { id: 'def456' },
  };
  const expectedFetchServersResult = { type: LIST_SERVERS, list };
  const ServersServiceMock = {
    listServers: jest.fn(() => list),
    createServer: jest.fn(),
    editServer: jest.fn(),
    deleteServer: jest.fn(),
    createServers: jest.fn(),
  };

  afterEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns servers when action is LIST_SERVERS', () =>
      expect(reducer({}, { type: LIST_SERVERS, list })).toEqual(list));

    it('returns edited server when action is EDIT_SERVER', () =>
      expect(reducer(
        list,
        { type: EDIT_SERVER, serverId: 'abc123', serverData: { foo: 'foo' } },
      )).toEqual({
        abc123: { id: 'abc123', foo: 'foo' },
        def456: { id: 'def456' },
      }));

    it('removes server when action is DELETE_SERVER', () =>
      expect(reducer(list, { type: DELETE_SERVER, serverId: 'abc123' })).toEqual({
        def456: { id: 'def456' },
      }));

    it('appends server when action is CREATE_SERVERS', () =>
      expect(reducer(list, {
        type: CREATE_SERVERS,
        newServers: {
          ghi789: { id: 'ghi789' },
        },
      })).toEqual({
        abc123: { id: 'abc123' },
        def456: { id: 'def456' },
        ghi789: { id: 'ghi789' },
      }));
  });

  describe('action creators', () => {
    xdescribe('listServers', () => {
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
        expect(dispatch).toHaveBeenNthCalledWith(1, { type: LIST_SERVERS, list: expectedList });
        expect(NoListServersServiceMock.listServers).toHaveBeenCalledTimes(1);
        expect(NoListServersServiceMock.createServer).not.toHaveBeenCalled();
        expect(NoListServersServiceMock.editServer).not.toHaveBeenCalled();
        expect(NoListServersServiceMock.deleteServer).not.toHaveBeenCalled();
        expect(NoListServersServiceMock.createServers).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledTimes(1);
      });
    });

    describe('createServer', () => {
      it('returns expected action', () => {
        const serverToCreate = { id: 'abc123' };
        const result = createServer(serverToCreate);

        expect(result).toEqual(expect.objectContaining({ type: CREATE_SERVERS }));
      });
    });

    describe('editServer', () => {
      it('returns expected action', () => {
        const serverData = { name: 'edited' };
        const result = editServer('123', serverData);

        expect(result).toEqual({ type: EDIT_SERVER, serverId: '123', serverData });
      });
    });

    describe('deleteServer', () => {
      it('returns expected action', () => {
        const serverToDelete = { id: 'abc123' };
        const result = deleteServer(serverToDelete);

        expect(result).toEqual({ type: DELETE_SERVER, serverId: 'abc123' });
      });
    });

    describe('createServers', () => {
      it('returns expected action', () => {
        const newServers = values(list);
        const result = createServers(newServers);

        expect(result).toEqual(expect.objectContaining({ type: CREATE_SERVERS }));
      });
    });
  });
});
