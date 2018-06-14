const PREFIX = 'shlink';
const buildPath = path => `${PREFIX}.${path}`;

export class ServersService {
  constructor(storage) {
    this.storage = storage;
  }

  listServers = () => {
    return JSON.parse(this.storage.getItem(buildPath('servers')) || '{}');
  };

  findServerById = serverId => {
    const servers = this.listServers();
    return servers[serverId];
  }
}

export default new ServersService(localStorage);
