import type { CsvToJson } from '../../utils/helpers/csvjson';
import type { ServerData } from '../data';

const validateServer = (server: any): server is ServerData =>
  typeof server.url === 'string' && typeof server.apiKey === 'string' && typeof server.name === 'string';

const validateServers = (servers: any): servers is ServerData[] =>
  Array.isArray(servers) && servers.every(validateServer);

export class ServersImporter {
  public constructor(private readonly csvToJson: CsvToJson) {}

  public async importServersFromFile(file: File | null | undefined): Promise<ServerData[]> {
    if (!file) {
      throw new Error('No file provided');
    }

    const content = await file.text();
    const servers = await this.csvToJson(content);

    if (!validateServers(servers)) {
      throw new Error('Provided file does not have the right format.');
    }

    return servers;
  }
}
