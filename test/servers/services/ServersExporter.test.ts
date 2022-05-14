import { Mock } from 'ts-mockery';
import ServersExporter from '../../../src/servers/services/ServersExporter';
import LocalStorage from '../../../src/utils/services/LocalStorage';
import { appendChild, removeChild, windowMock } from '../../mocks/WindowMock';

describe('ServersExporter', () => {
  const storageMock = Mock.of<LocalStorage>({
    get: jest.fn(() => ({
      abc123: {
        id: 'abc123',
        name: 'foo',
        autoConnect: true,
      },
      def456: {
        id: 'def456',
        name: 'bar',
        autoConnect: false,
      },
    })),
  });
  const erroneousToCsv = jest.fn(() => {
    throw new Error('');
  });
  const createCsvjsonMock = (throwError = false) => (throwError ? erroneousToCsv : jest.fn(() => ''));

  beforeEach(jest.clearAllMocks);

  describe('exportServers', () => {
    let originalConsole: Console;
    const error = jest.fn();

    beforeEach(() => {
      originalConsole = global.console;
      global.console = Mock.of<Console>({ error });
      (global as any).Blob = class Blob {};
      (global as any).URL = { createObjectURL: () => '' };
    });
    afterEach(() => {
      global.console = originalConsole;
    });

    it('logs an error if something fails', () => {
      const csvjsonMock = createCsvjsonMock(true);
      const exporter = new ServersExporter(storageMock, windowMock, csvjsonMock);

      exporter.exportServers();

      expect(error).toHaveBeenCalledTimes(1);
      expect(erroneousToCsv).toHaveBeenCalledTimes(1);
    });

    it('makes use of download link API', () => {
      const exporter = new ServersExporter(storageMock, windowMock, createCsvjsonMock());
      const { document: { createElement } } = windowMock;

      exporter.exportServers();

      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(createElement).toHaveBeenCalledTimes(1);
      expect(appendChild).toHaveBeenCalledTimes(1);
      expect(removeChild).toHaveBeenCalledTimes(1);
    });
  });
});
