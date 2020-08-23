import { CsvJson } from 'csvjson';
import { ServerData } from '../data';

const CSV_MIME_TYPE = 'text/csv';

export default class ServersImporter {
  public constructor(private readonly csvjson: CsvJson, private readonly fileReaderFactory: () => FileReader) {}

  public importServersFromFile = async (file?: File | null): Promise<ServerData[]> => {
    if (!file || file.type !== CSV_MIME_TYPE) {
      throw new Error('No file provided or file is not a CSV');
    }

    const reader = this.fileReaderFactory();

    return new Promise((resolve) => {
      reader.addEventListener('loadend', (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result?.toString() ?? '';
        const servers = this.csvjson.toObject<ServerData>(content);

        resolve(servers);
      });
      reader.readAsText(file);
    });
  };
}
