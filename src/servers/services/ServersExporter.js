import { dissoc, head, keys, values } from 'ramda';

const saveCsv = (window, csv) => {
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
  constructor(storage, window, csvjson) {
    this.storage = storage;
    this.window = window;
    this.csvjson = csvjson;
  }

  exportServers = async () => {
    const servers = values(this.storage.get('servers') || {}).map(dissoc('id'));

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
