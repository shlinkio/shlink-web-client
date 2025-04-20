import type { CsvToJson } from '../../utils/helpers/csvjson';
import type { ServerData } from '../data';
import { deserializeServer } from '../data';

const validateAndDeserializeServers = (servers: unknown): ServerData[] => {
  if (!Array.isArray(servers)) {
    throw new Error('Provided file does not have the right format.');
  }
  return servers.map(deserializeServer);
};

export class ServersImporter {
  readonly #csvToJson: CsvToJson;

  public constructor(csvToJson: CsvToJson) {
    this.#csvToJson = csvToJson;
  }

  public async importServersFromFile(file: File | null | undefined): Promise<ServerData[]> {
    if (!file) {
      throw new Error('No file provided');
    }

    const content = await file.text();
    const servers = await this.#csvToJson(content);

    return validateAndDeserializeServers(servers);
  }
}
