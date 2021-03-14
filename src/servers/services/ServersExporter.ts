import { dissoc, values } from 'ramda';
import { CsvJson } from 'csvjson';
import LocalStorage from '../../utils/services/LocalStorage';
import { ServersMap } from '../data';
import { saveCsv } from '../../utils/helpers/csv';

const SERVERS_FILENAME = 'shlink-servers.csv';

export default class ServersExporter {
  public constructor(
    private readonly storage: LocalStorage,
    private readonly window: Window,
    private readonly csvjson: CsvJson,
  ) {}

  public readonly exportServers = async () => {
    const servers = values(this.storage.get<ServersMap>('servers') ?? {}).map(dissoc('id'));

    try {
      const csv = this.csvjson.toCSV(servers, { headers: 'key' });

      saveCsv(this.window, csv, SERVERS_FILENAME);
    } catch (e) {
      // FIXME Handle error
      console.error(e);
    }
  };
}
