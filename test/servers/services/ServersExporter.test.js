import sinon from 'sinon';
import { ServersExporter } from '../../../src/servers/services/ServersExporter';

describe('ServersExporter', () => {
  const createLinkMock = () => ({
    setAttribute: sinon.fake(),
    click: sinon.fake(),
    style: {},
  });
  const createWindowMock = (isIe10 = true) => ({
    navigator: {
      msSaveBlob: isIe10 ? sinon.fake() : undefined,
    },
    document: {
      createElement: sinon.fake.returns(createLinkMock()),
      body: {
        appendChild: sinon.fake(),
        removeChild: sinon.fake(),
      },
    },
  });
  const serversServiceMock = {
    listServers: sinon.fake.returns({
      abc123: {
        id: 'abc123',
        name: 'foo',
      },
      def456: {
        id: 'def456',
        name: 'bar',
      },
    }),
  };
  const createCsvjsonMock = (throwError = false) => ({
    toCSV: throwError ? sinon.fake.throws('') : sinon.fake.returns(''),
  });

  describe('exportServers', () => {
    let originalConsole;

    beforeEach(() => {
      originalConsole = global.console;
      global.console = { error: sinon.fake() };
      global.Blob = class Blob {};
      global.URL = { createObjectURL: () => '' };
      serversServiceMock.listServers.resetHistory();
    });
    afterEach(() => {
      global.console = originalConsole;
    });

    it('logs an error if something fails', () => {
      const csvjsonMock = createCsvjsonMock(true);
      const exporter = new ServersExporter(
        serversServiceMock,
        createWindowMock(),
        csvjsonMock,
      );

      exporter.exportServers();

      expect(global.console.error.callCount).toEqual(1);
      expect(csvjsonMock.toCSV.callCount).toEqual(1);
    });

    it('makes use of msSaveBlob API when available', () => {
      const windowMock = createWindowMock();
      const exporter = new ServersExporter(
        serversServiceMock,
        windowMock,
        createCsvjsonMock(),
      );

      exporter.exportServers();

      expect(serversServiceMock.listServers.callCount).toEqual(1);
      expect(windowMock.navigator.msSaveBlob.callCount).toEqual(1);
      expect(windowMock.document.createElement.callCount).toEqual(0);
    });

    it('makes use of download link API when available', () => {
      const windowMock = createWindowMock(false);
      const exporter = new ServersExporter(
        serversServiceMock,
        windowMock,
        createCsvjsonMock(),
      );

      exporter.exportServers();

      expect(serversServiceMock.listServers.callCount).toEqual(1);
      expect(windowMock.document.createElement.callCount).toEqual(1);
      expect(windowMock.document.body.appendChild.callCount).toEqual(1);
      expect(windowMock.document.body.removeChild.callCount).toEqual(1);
    });
  });
});
