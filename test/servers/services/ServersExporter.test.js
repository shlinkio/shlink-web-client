import ServersExporter from '../../../src/servers/services/ServersExporter';

describe('ServersExporter', () => {
  const createLinkMock = () => ({
    setAttribute: jest.fn(),
    click: jest.fn(),
    style: {},
  });
  const createWindowMock = (isIe10 = true) => ({
    navigator: {
      msSaveBlob: isIe10 ? jest.fn() : undefined,
    },
    document: {
      createElement: jest.fn(() => createLinkMock()),
      body: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
      },
    },
  });
  const storageMock = {
    get: jest.fn(() => ({
      abc123: {
        id: 'abc123',
        name: 'foo',
      },
      def456: {
        id: 'def456',
        name: 'bar',
      },
    })),
  };
  const createCsvjsonMock = (throwError = false) => ({
    toCSV: jest.fn(() => {
      if (throwError) {
        throw new Error('');
      }

      return '';
    }),
  });

  describe('exportServers', () => {
    let originalConsole;

    beforeEach(() => {
      originalConsole = global.console;
      global.console = { error: jest.fn() };
      global.Blob = class Blob {};
      global.URL = { createObjectURL: () => '' };
    });
    afterEach(() => {
      global.console = originalConsole;
      jest.clearAllMocks();
    });

    it('logs an error if something fails', () => {
      const csvjsonMock = createCsvjsonMock(true);
      const exporter = new ServersExporter(storageMock, createWindowMock(), csvjsonMock);

      exporter.exportServers();

      expect(global.console.error).toHaveBeenCalledTimes(1);
      expect(csvjsonMock.toCSV).toHaveBeenCalledTimes(1);
    });

    it('makes use of msSaveBlob API when available', () => {
      const windowMock = createWindowMock();
      const exporter = new ServersExporter(storageMock, windowMock, createCsvjsonMock());

      exporter.exportServers();

      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(windowMock.navigator.msSaveBlob).toHaveBeenCalledTimes(1);
      expect(windowMock.document.createElement).not.toHaveBeenCalled();
    });

    it('makes use of download link API when available', () => {
      const windowMock = createWindowMock(false);
      const exporter = new ServersExporter(storageMock, windowMock, createCsvjsonMock());

      exporter.exportServers();

      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(windowMock.document.createElement).toHaveBeenCalledTimes(1);
      expect(windowMock.document.body.appendChild).toHaveBeenCalledTimes(1);
      expect(windowMock.document.body.removeChild).toHaveBeenCalledTimes(1);
    });
  });
});
