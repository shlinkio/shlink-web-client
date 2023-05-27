import { fromPartial } from '@total-typescript/shoehorn';
import { ServersExporter } from '../../../src/servers/services/ServersExporter';
import type { LocalStorage } from '../../../src/utils/services/LocalStorage';
import { appendChild, removeChild, windowMock } from '../../__mocks__/Window.mock';

describe('ServersExporter', () => {
  const storageMock = fromPartial<LocalStorage>({
    get: vi.fn(() => ({
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
    } as any)),
  });
  const erroneousToCsv = vi.fn(() => {
    throw new Error('');
  });
  const createCsvjsonMock = (throwError = false) => (throwError ? erroneousToCsv : vi.fn(() => ''));

  describe('exportServers', () => {
    let originalConsole: Console;
    const error = vi.fn();

    beforeEach(() => {
      originalConsole = global.console;
      global.console = fromPartial<Console>({ error });
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
