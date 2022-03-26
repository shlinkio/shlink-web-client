import { dissoc, values } from 'ramda';
import { Mock } from 'ts-mockery';
import reducer, {
  createServer,
  deleteServer,
  createServers,
  editServer,
  setAutoConnect,
  EDIT_SERVER,
  DELETE_SERVER,
  CREATE_SERVERS,
  SET_AUTO_CONNECT,
} from '../../../src/servers/reducers/servers';
import { RegularServer } from '../../../src/servers/data';

describe('serverReducer', () => {
  const list = {
    abc123: Mock.of<RegularServer>({ id: 'abc123' }),
    def456: Mock.of<RegularServer>({ id: 'def456' }),
  };

  afterEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns edited server when action is EDIT_SERVER', () =>
      expect(reducer(
        list,
        { type: EDIT_SERVER, serverId: 'abc123', serverData: { foo: 'foo' } } as any,
      )).toEqual({
        abc123: { id: 'abc123', foo: 'foo' },
        def456: { id: 'def456' },
      }));

    it('returns as it is when action is EDIT_SERVER and server does not exist', () =>
      expect(reducer(
        list,
        { type: EDIT_SERVER, serverId: 'invalid', serverData: { foo: 'foo' } } as any,
      )).toEqual({
        abc123: { id: 'abc123' },
        def456: { id: 'def456' },
      }));

    it('removes server when action is DELETE_SERVER', () =>
      expect(reducer(list, { type: DELETE_SERVER, serverId: 'abc123' } as any)).toEqual({
        def456: { id: 'def456' },
      }));

    it('appends server when action is CREATE_SERVERS', () =>
      expect(reducer(list, {
        type: CREATE_SERVERS,
        newServers: {
          ghi789: { id: 'ghi789' },
        },
      } as any)).toEqual({
        abc123: { id: 'abc123' },
        def456: { id: 'def456' },
        ghi789: { id: 'ghi789' },
      }));

    it.each([
      [true],
      [false],
    ])('returns state as it is when trying to set auto-connect on invalid server', (autoConnect) =>
      expect(reducer(list, {
        type: SET_AUTO_CONNECT,
        serverId: 'invalid',
        autoConnect,
      } as any)).toEqual({
        abc123: { id: 'abc123' },
        def456: { id: 'def456' },
      }));

    it('disables auto-connect on a server which is already set to auto-connect', () => {
      const listWithDisabledAutoConnect = {
        ...list,
        abc123: { ...list.abc123, autoConnect: true },
      };

      expect(reducer(listWithDisabledAutoConnect, {
        type: SET_AUTO_CONNECT,
        serverId: 'abc123',
        autoConnect: false,
      } as any)).toEqual({
        abc123: { id: 'abc123', autoConnect: false },
        def456: { id: 'def456' },
      });
    });

    it('disables auto-connect on all servers except selected one', () => {
      const listWithEnabledAutoConnect = {
        ...list,
        abc123: { ...list.abc123, autoConnect: true },
      };

      expect(reducer(listWithEnabledAutoConnect, {
        type: SET_AUTO_CONNECT,
        serverId: 'def456',
        autoConnect: true,
      } as any)).toEqual({
        abc123: { id: 'abc123', autoConnect: false },
        def456: { id: 'def456', autoConnect: true },
      });
    });
  });

  describe('action creators', () => {
    describe('createServer', () => {
      it('returns expected action', () => {
        const serverToCreate = Mock.of<RegularServer>({ id: 'abc123' });
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
        const serverToDelete = Mock.of<RegularServer>({ id: 'abc123' });
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

      it('generates an id for every provided server if they do not have it', () => {
        const servers = values(list).map(dissoc('id'));
        const { newServers } = createServers(servers);

        expect(values(newServers).every(({ id }) => !!id)).toEqual(true);
      });
    });

    describe('setAutoConnect', () => {
      it.each([
        [true],
        [false],
      ])('returns expected action', (autoConnect) => {
        const serverToEdit = Mock.of<RegularServer>({ id: 'abc123' });
        const result = setAutoConnect(serverToEdit, autoConnect);

        expect(result).toEqual({ type: SET_AUTO_CONNECT, serverId: 'abc123', autoConnect });
      });
    });
  });
});
