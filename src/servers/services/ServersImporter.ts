import { ServerData } from '../data';
import { CsvToJson } from '../../utils/helpers/csvjson';

const validateServer = (server: any): server is ServerData =>
  typeof server.url === 'string' && typeof server.apiKey === 'string' && typeof server.name === 'string';

const validateServers = (servers: any): servers is ServerData[] =>
  Array.isArray(servers) && servers.every(validateServer);

export class ServersImporter {
  public constructor(private readonly csvToJson: CsvToJson, private readonly fileReaderFactory: () => FileReader) {}

  public readonly importServersFromFile = async (file?: File | null): Promise<ServerData[]> => {
    if (!file) {
      throw new Error('No file provided');
    }

    const reader = this.fileReaderFactory();

    return new Promise((resolve, reject) => {
      reader.addEventListener('loadend', async (e: ProgressEvent<FileReader>) => {
        try {
          // TODO Read as stream, otherwise, if the file is too big, this will block the browser tab
          const content = e.target?.result?.toString() ?? '';
          const servers = await this.csvToJson(content);

          if (!validateServers(servers)) {
            throw new Error('Provided file does not have the right format.');
          }

          resolve(servers);
        } catch (error) {
          reject(error);
        }
      });
      reader.readAsText(file);
    });
  };
}
