import { values } from 'ramda';
import reducer, {
  createServer,
  deleteServer,
  createServers,
  editServer,
  EDIT_SERVER,
  DELETE_SERVER,
  CREATE_SERVERS,
} from '../../../src/servers/reducers/servers';

describe('serverReducer', () => {
  const list = {
    abc123: { id: 'abc123' },
    def456: { id: 'def456' },
  };

  afterEach(jest.clearAllMocks);

  describe('reducer', () => {
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
