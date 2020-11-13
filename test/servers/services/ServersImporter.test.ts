import { Mock } from 'ts-mockery';
import { CsvJson } from 'csvjson';
import ServersImporter from '../../../src/servers/services/ServersImporter';
import { RegularServer } from '../../../src/servers/data';

describe('ServersImporter', () => {
  const servers: RegularServer[] = [ Mock.all<RegularServer>(), Mock.all<RegularServer>() ];
  const toObject = jest.fn().mockReturnValue(servers);
  const csvjsonMock = Mock.of<CsvJson>({ toObject });
  const readAsText = jest.fn();
  const fileReaderMock = Mock.of<FileReader>({
    readAsText,
    addEventListener: (_eventName: string, listener: Function) => listener({ target: { result: '' } }),
  });
  const importer = new ServersImporter(csvjsonMock, () => fileReaderMock);

  beforeEach(jest.clearAllMocks);

  describe('importServersFromFile', () => {
    it('rejects with error if no file was provided', async () => {
      await expect(importer.importServersFromFile()).rejects.toEqual(
        new Error('No file provided or file is not a CSV'),
      );
    });

    it('rejects with error if provided file is not a CSV', async () => {
      await expect(importer.importServersFromFile(Mock.of<File>({ type: 'text/html' }))).rejects.toEqual(
        new Error('No file provided or file is not a CSV'),
      );
    });

    it('reads file when a CSV is provided', async () => {
      await importer.importServersFromFile(Mock.of<File>({ type: 'text/csv' }));

      expect(readAsText).toHaveBeenCalledTimes(1);
      expect(toObject).toHaveBeenCalledTimes(1);
    });
  });
});
