import { CsvJson } from 'csvjson';
import { ServerData } from '../data';

interface CsvFile extends File {
  type: 'text/csv' | 'text/comma-separated-values' | 'application/csv';
}

const CSV_MIME_TYPES = [ 'text/csv', 'text/comma-separated-values', 'application/csv' ];
const isCsv = (file?: File | null): file is CsvFile => !!file && CSV_MIME_TYPES.includes(file.type);

export default class ServersImporter {
  public constructor(private readonly csvjson: CsvJson, private readonly fileReaderFactory: () => FileReader) {}

  public readonly importServersFromFile = async (file?: File | null): Promise<ServerData[]> => {
    if (!isCsv(file)) {
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
