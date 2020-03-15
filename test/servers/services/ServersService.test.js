import ServersService from '../../../src/servers/services/ServersService';

describe('ServersService', () => {
  const servers = {
    abc123: { id: 'abc123' },
    def456: { id: 'def456' },
  };
  const createService = (withServers = true) => {
    const storageMock = {
      set: jest.fn(),
      get: jest.fn(() => withServers ? servers : undefined),
    };
    const service = new ServersService(storageMock);

    return [ service, storageMock ];
  };

  describe('listServers', () => {
    it('returns an empty object when servers are not found in storage', () => {
      const [ service, storageMock ] = createService(false);

      const result = service.listServers();

      expect(result).toEqual({});
      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).not.toHaveBeenCalled();
    });

    it('returns value from storage when found', () => {
      const [ service, storageMock ] = createService();

      const result = service.listServers();

      expect(result).toEqual(servers);
      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).not.toHaveBeenCalled();
    });
  });

  describe('findServerById', () => {
    it('returns undefined when requested server is not found', () => {
      const [ service, storageMock ] = createService();

      const result = service.findServerById('ghi789');

      expect(result).toBeUndefined();
      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).not.toHaveBeenCalled();
    });

    it('returns server from list when found', () => {
      const [ service, storageMock ] = createService();

      const result = service.findServerById('abc123');

      expect(result).toEqual({ id: 'abc123' });
      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).not.toHaveBeenCalled();
    });
  });

  describe('createServer', () => {
    it('adds one server to the list', () => {
      const [ service, storageMock ] = createService();

      service.createServer({ id: 'ghi789' });

      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).toHaveBeenCalledTimes(1);
      expect(storageMock.set).toHaveBeenCalledWith(expect.anything(), {
        abc123: { id: 'abc123' },
        def456: { id: 'def456' },
        ghi789: { id: 'ghi789' },
      });
    });
  });

  describe('createServers', () => {
    it('adds multiple servers to the list', () => {
      const [ service, storageMock ] = createService();

      service.createServers([{ id: 'ghi789' }, { id: 'jkl123' }]);

      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).toHaveBeenCalledTimes(1);
      expect(storageMock.set).toHaveBeenCalledWith(expect.anything(), {
        abc123: { id: 'abc123' },
        def456: { id: 'def456' },
        ghi789: { id: 'ghi789' },
        jkl123: { id: 'jkl123' },
      });
    });
  });

  describe('deleteServer', () => {
    it('removes one server from the list', () => {
      const [ service, storageMock ] = createService();

      service.deleteServer({ id: 'abc123' });

      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(storageMock.set).toHaveBeenCalledTimes(1);
      expect(storageMock.set).toHaveBeenCalledWith(expect.anything(), {
        def456: { id: 'def456' },
      });
    });
  });

  describe('editServer', () => {
    it('dos nothing is provided server does not exist', () => {
      const [ service, storageMock ] = createService();

      service.editServer('notFound', {});

      expect(storageMock.set).not.toHaveBeenCalled();
    });

    it('updates the list with provided server data', () => {
      const [ service, storageMock ] = createService();
      const serverData = { name: 'foo', apiKey: 'bar' };

      service.editServer('abc123', serverData);

      expect(storageMock.set).toHaveBeenCalledWith(expect.anything(), {
        abc123: { id: 'abc123', ...serverData },
        def456: { id: 'def456' },
      });
    });
  });
});
