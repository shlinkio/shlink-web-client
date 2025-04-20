import { fromPartial } from '@total-typescript/shoehorn';
import type { ServersMap } from '../../../src/servers/data';
import { serializeServer } from '../../../src/servers/data';
import { ServersExporter } from '../../../src/servers/services/ServersExporter';
import type { LocalStorage } from '../../../src/utils/services/LocalStorage';
import { appendChild, removeChild, windowMock } from '../../__mocks__/Window.mock';

describe('ServersExporter', () => {
  const servers: ServersMap = {
    abc123: {
      id: 'abc123',
      name: 'foo',
      url: 'https://foo.com',
      apiKey: 'foo_api_key',
      autoConnect: true,
    },
    def456: {
      id: 'def456',
      name: 'bar',
      url: 'https://bar.com',
      apiKey: 'bar_api_key',
      forwardCredentials: true,
      autoConnect: false,
    },
  };
  const storageMock = fromPartial<LocalStorage>({
    get: vi.fn(() => servers as any),
  });
  const erroneousToCsv = vi.fn(() => {
    throw new Error('');
  });
  const createJsonToCsvMock = (throwError = false) => (throwError ? erroneousToCsv : vi.fn(() => ''));

  describe('exportServers', () => {
    const error = vi.fn();

    beforeEach(() => {
      vi.stubGlobal('console', fromPartial<Console>({ error }));
    });
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('logs an error if something fails', () => {
      const jsonToCsvMock = createJsonToCsvMock(true);
      const exporter = new ServersExporter(storageMock, windowMock, jsonToCsvMock);

      exporter.exportServers();

      expect(error).toHaveBeenCalledTimes(1);
      expect(erroneousToCsv).toHaveBeenCalledTimes(1);
    });

    it('makes use of download link API', () => {
      const jsonToCsvMock = createJsonToCsvMock();
      const exporter = new ServersExporter(storageMock, windowMock, jsonToCsvMock);
      const { document: { createElement } } = windowMock;

      exporter.exportServers();

      expect(storageMock.get).toHaveBeenCalledTimes(1);
      expect(createElement).toHaveBeenCalledTimes(1);
      expect(appendChild).toHaveBeenCalledTimes(1);
      expect(removeChild).toHaveBeenCalledTimes(1);
      expect(jsonToCsvMock).toHaveBeenCalledWith(Object.values(servers).map(serializeServer));
    });
  });
});
