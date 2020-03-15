import { assoc, dissoc, reduce } from 'ramda';

const SERVERS_STORAGE_KEY = 'servers';

export default class ServersService {
  constructor(storage) {
    this.storage = storage;
  }

  listServers = () => this.storage.get(SERVERS_STORAGE_KEY) || {};

  findServerById = (serverId) => this.listServers()[serverId];

  createServer = (server) => this.createServers([ server ]);

  createServers = (servers) => {
    const allServers = reduce(
      (serversObj, server) => assoc(server.id, server, serversObj),
      this.listServers(),
      servers
    );

    this.storage.set(SERVERS_STORAGE_KEY, allServers);
  };

  deleteServer = ({ id }) =>
    this.storage.set(SERVERS_STORAGE_KEY, dissoc(id, this.listServers()));

  editServer = (id, serverData) => {
    const allServers = this.listServers();

    if (!allServers[id]) {
      return;
    }

    this.storage.set(SERVERS_STORAGE_KEY, assoc(id, { ...allServers[id], ...serverData }, allServers));
  }
}
