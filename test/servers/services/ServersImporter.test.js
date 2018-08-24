import { ServersImporter } from '../../../src/servers/services/ServersImporter';
import sinon from 'sinon';

describe('ServersImporter', () => {
  const servers = [{ name: 'foo' }, { name: 'bar' }];
  const csvjsonMock = {
    toObject: sinon.fake.returns(servers),
  };
  const importer = new ServersImporter(csvjsonMock);

  beforeEach(() => csvjsonMock.toObject.resetHistory());

  describe('importServersFromFile', () => {
    it('rejects with error if no file was provided', async () => {
      try {
        await importer.importServersFromFile();
      } catch (e) {
        expect(e).toEqual('No file provided or file is not a CSV');
      }
    });

    it('rejects with error if provided file is not a CSV', async () => {
      try {
        await importer.importServersFromFile({ type: 'text/html' });
      } catch (e) {
        expect(e).toEqual('No file provided or file is not a CSV');
      }
    });

    it('reads file when a CSV is provided', async () => {
      const readAsText = sinon.fake.returns('');
      global.FileReader = function FileReader() {
        this.readAsText = readAsText;
        this.addEventListener = (eventName, listener) =>
          listener({ target: { result: '' } });
      };

      await importer.importServersFromFile({ type: 'text/csv' });

      expect(readAsText.callCount).toEqual(1);
      expect(csvjsonMock.toObject.callCount).toEqual(1);
    });
  });
});
