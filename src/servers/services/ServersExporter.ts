import { dissoc, head, keys, values } from 'ramda';
import { CsvJson } from 'csvjson';
import LocalStorage from '../../utils/services/LocalStorage';
import { ServersMap } from '../data';

const saveCsv = (window: Window, csv: string) => {
  const { navigator, document } = window;
  const filename = 'shlink-servers.csv';
  const blob = new Blob([ csv ], { type: 'text/csv;charset=utf-8;' });

  // IE10 and IE11
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);

    return;
  }

  // Modern browsers
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default class ServersExporter {
  public constructor(
    private readonly storage: LocalStorage,
    private readonly window: Window,
    private readonly csvjson: CsvJson,
  ) {}

  public readonly exportServers = async () => {
    const servers = values(this.storage.get<ServersMap>('servers') ?? {}).map(dissoc('id'));

    try {
      const csv = this.csvjson.toCSV(servers, {
        headers: keys(head(servers)).join(','),
      });

      saveCsv(this.window, csv);
    } catch (e) {
      // FIXME Handle error
      /* eslint no-console: "off" */
      console.error(e);
    }
  };
}
