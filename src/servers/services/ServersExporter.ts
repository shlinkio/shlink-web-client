import { values } from 'ramda';
import type { JsonToCsv } from '../../utils/helpers/csvjson';
import { saveCsv } from '../../utils/helpers/files';
import type { LocalStorage } from '../../utils/services/LocalStorage';
import type { ServersMap } from '../data';
import { serverWithIdToServerData } from '../data';

const SERVERS_FILENAME = 'shlink-servers.csv';

export class ServersExporter {
  public constructor(
    private readonly storage: LocalStorage,
    private readonly window: Window,
    private readonly jsonToCsv: JsonToCsv,
  ) {}

  public readonly exportServers = async () => {
    const servers = values(this.storage.get<ServersMap>('servers') ?? {}).map(serverWithIdToServerData);

    try {
      const csv = this.jsonToCsv(servers);

      saveCsv(this.window, csv, SERVERS_FILENAME);
    } catch (e) {
      // FIXME Handle error
      console.error(e); // eslint-disable-line no-console
    }
  };
}
