import type { JsonToCsv } from '../../utils/helpers/csvjson';
import { saveCsv } from '../../utils/helpers/files';
import type { LocalStorage } from '../../utils/services/LocalStorage';
import type { ServersMap } from '../data';
import { serializeServer } from '../data';

const SERVERS_FILENAME = 'shlink-servers.csv';

export class ServersExporter {
  readonly #storage: LocalStorage;
  readonly #window: Window;
  readonly #jsonToCsv: JsonToCsv;

  public constructor(storage: LocalStorage, window: Window, jsonToCsv: JsonToCsv) {
    this.#storage = storage;
    this.#window = window;
    this.#jsonToCsv = jsonToCsv;
  }

  public readonly exportServers = async () => {
    const servers = Object.values(this.#storage.get<ServersMap>('servers') ?? {}).map(serializeServer);

    try {
      const csv = this.#jsonToCsv(servers);
      saveCsv(this.#window, csv, SERVERS_FILENAME);
    } catch (e) {
      // FIXME Handle error
      console.error(e);
    }
  };
}
