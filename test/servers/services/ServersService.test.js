import { last } from 'ramda';
import ServersService from '../../../src/servers/services/ServersService';

describe('ServersService', () => {
  const servers = {
    abc123: { id: 'abc123' },
    def456: { id: 'def456' },
  };
  const createStorageMock = (returnValue) => ({
    set: jest.fn(),
    get: jest.fn(() => returnValue),
  });

  describe('listServers', () => {
    it('returns an empty object when servers are not found in storage', () => {
      const storageMock = createStorageMock();
      const service = new ServersService(storageMock);

      const result = service.listServers();

      expect(result).toEqual({});
      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).not.toHaveBeenCalled();
    });

    it('returns value from storage when found', () => {
      const storageMock = createStorageMock(servers);
      const service = new ServersService(storageMock);

      const result = service.listServers();

      expect(result).toEqual(servers);
      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).not.toHaveBeenCalled();
    });
  });

  describe('findServerById', () => {
    it('returns undefined when requested server is not found', () => {
      const storageMock = createStorageMock(servers);
      const service = new ServersService(storageMock);

      const result = service.findServerById('ghi789');

      expect(result).toBeUndefined();
      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).not.toHaveBeenCalled();
    });

    it('returns server from list when found', () => {
      const storageMock = createStorageMock(servers);
      const service = new ServersService(storageMock);

      const result = service.findServerById('abc123');

      expect(result).toEqual({ id: 'abc123' });
      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).not.toHaveBeenCalled();
    });
  });

  describe('createServer', () => {
    it('adds one server to the list', () => {
      const storageMock = createStorageMock(servers);
      const service = new ServersService(storageMock);

      service.createServer({ id: 'ghi789' });

      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).toHaveBeenCalledTimes(1);

      const setLastCallLastArg = last(last(storageMock.set.mock.calls));

      expect(setLastCallLastArg).toEqual({
        abc123: { id: 'abc123' },
        def456: { id: 'def456' },
        ghi789: { id: 'ghi789' },
      });
    });
  });

  describe('createServers', () => {
    it('adds multiple servers to the list', () => {
      const storageMock = createStorageMock(servers);
      const service = new ServersService(storageMock);

      service.createServers([{ id: 'ghi789' }, { id: 'jkl123' }]);

      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).toHaveBeenCalledTimes(1);

      const setLastCallLastArg = last(last(storageMock.set.mock.calls));

      expect(setLastCallLastArg).toEqual({
        abc123: { id: 'abc123' },
        def456: { id: 'def456' },
        ghi789: { id: 'ghi789' },
        jkl123: { id: 'jkl123' },
      });
    });
  });

  describe('deleteServer', () => {
    it('removes one server from the list', () => {
      const storageMock = createStorageMock(servers);
      const service = new ServersService(storageMock);

      service.deleteServer({ id: 'abc123' });

      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).toHaveBeenCalledTimes(1);

      const setLastCallLastArg = last(last(storageMock.set.mock.calls));

      expect(setLastCallLastArg).toEqual({
        def456: { id: 'def456' },
      });
    });
  });
});
