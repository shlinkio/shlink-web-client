import csvjson from 'csvjson';
import PropTypes from 'prop-types';

export const serversImporterType = PropTypes.shape({
  importServersFromFile: PropTypes.func,
});

export class ServersImporter {
  constructor(csvjson) {
    this.csvjson = csvjson;
  }

  importServersFromFile = (file) => {
    if (!file || file.type !== 'text/csv') {
      return Promise.reject('No file provided or file is not a CSV');
    }

    const reader = new FileReader();

    return new Promise((resolve) => {
      reader.addEventListener('loadend', (e) => {
        const content = e.target.result;
        const servers = this.csvjson.toObject(content);

        resolve(servers);
      });
      reader.readAsText(file);
    });
  };
}

const serversImporter = new ServersImporter(csvjson);

export default serversImporter;
