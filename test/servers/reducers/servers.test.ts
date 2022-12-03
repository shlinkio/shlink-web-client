import { dissoc, values } from 'ramda';
import { Mock } from 'ts-mockery';
import {
  deleteServer,
  createServers,
  editServer,
  setAutoConnect,
  serversReducer,
} from '../../../src/servers/reducers/servers';
import { RegularServer } from '../../../src/servers/data';

describe('serversReducer', () => {
  const list = {
    abc123: Mock.of<RegularServer>({ id: 'abc123' }),
    def456: Mock.of<RegularServer>({ id: 'def456' }),
  };

  afterEach(jest.clearAllMocks);

  describe('reducer', () => {
    it('returns edited server when action is EDIT_SERVER', () =>
      expect(serversReducer(list, {
        type: editServer.toString(),
        payload: { serverId: 'abc123', serverData: { foo: 'foo' } },
      })).toEqual({
        abc123: { id: 'abc123', foo: 'foo' },
        def456: { id: 'def456' },
      }));

    it('returns as it is when action is EDIT_SERVER and server does not exist', () =>
      expect(serversReducer(list, {
        type: editServer.toString(),
        payload: { serverId: 'invalid', serverData: { foo: 'foo' } },
      })).toEqual({
        abc123: { id: 'abc123' },
        def456: { id: 'def456' },
      }));

    it('removes server when action is DELETE_SERVER', () =>
      expect(serversReducer(list, {
        type: deleteServer.toString(),
        payload: { id: 'abc123' },
      })).toEqual({
        def456: { id: 'def456' },
      }));

    it('appends server when action is CREATE_SERVERS', () =>
      expect(serversReducer(list, {
        type: createServers.toString(),
        payload: {
          ghi789: { id: 'ghi789' },
        },
      })).toEqual({
        abc123: { id: 'abc123' },
        def456: { id: 'def456' },
        ghi789: { id: 'ghi789' },
      }));

    it.each([
      [true],
      [false],
    ])('returns state as it is when trying to set auto-connect on invalid server', (autoConnect) =>
      expect(serversReducer(list, {
        type: setAutoConnect.toString(),
        payload: { serverId: 'invalid', autoConnect },
      })).toEqual({
        abc123: { id: 'abc123' },
        def456: { id: 'def456' },
      }));

    it('disables auto-connect on a server which is already set to auto-connect', () => {
      const listWithDisabledAutoConnect = {
        ...list,
        abc123: { ...list.abc123, autoConnect: true },
      };

      expect(serversReducer(listWithDisabledAutoConnect, {
        type: setAutoConnect.toString(),
        payload: { serverId: 'abc123', autoConnect: false },
      })).toEqual({
        abc123: { id: 'abc123', autoConnect: false },
        def456: { id: 'def456' },
      });
    });

    it('disables auto-connect on all servers except selected one', () => {
      const listWithEnabledAutoConnect = {
        ...list,
        abc123: { ...list.abc123, autoConnect: true },
      };

      expect(serversReducer(listWithEnabledAutoConnect, {
        type: setAutoConnect.toString(),
        payload: { serverId: 'def456', autoConnect: true },
      })).toEqual({
        abc123: { id: 'abc123', autoConnect: false },
        def456: { id: 'def456', autoConnect: true },
      });
    });
  });

  describe('action creators', () => {
    describe('editServer', () => {
      it('returns expected action', () => {
        const serverData = { name: 'edited' };
        const result = editServer('123', serverData);

        expect(result).toEqual({
          type: editServer.toString(),
          payload: { serverId: '123', serverData },
        });
      });
    });

    describe('deleteServer', () => {
      it('returns expected action', () => {
        const serverToDelete = Mock.of<RegularServer>({ id: 'abc123' });
        const result = deleteServer(serverToDelete);

        expect(result).toEqual({
          type: deleteServer.toString(),
          payload: { id: 'abc123' },
        });
      });
    });

    describe('createServers', () => {
      it('returns expected action', () => {
        const newServers = values(list);
        const result = createServers(newServers);

        expect(result).toEqual(expect.objectContaining({ type: createServers.toString() }));
      });

      it('generates an id for every provided server if they do not have it', () => {
        const servers = values(list).map(dissoc('id'));
        const { payload } = createServers(servers);

        expect(values(payload).every(({ id }) => !!id)).toEqual(true);
      });
    });

    describe('setAutoConnect', () => {
      it.each([
        [true],
        [false],
      ])('returns expected action', (autoConnect) => {
        const serverToEdit = Mock.of<RegularServer>({ id: 'abc123' });
        const result = setAutoConnect(serverToEdit, autoConnect);

        expect(result).toEqual({
          type: setAutoConnect.toString(),
          payload: { serverId: 'abc123', autoConnect },
        });
      });
    });
  });
});
