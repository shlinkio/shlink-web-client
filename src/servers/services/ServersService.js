import { assoc, curry, dissoc, reduce } from 'ramda';

const SERVERS_STORAGE_KEY = 'servers';

export default class ServersService {
  constructor(storage) {
    this.storage = storage;
    this.setServers = curry(this.storage.set)(SERVERS_STORAGE_KEY);
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

    this.setServers(allServers);
  };

  deleteServer = ({ id }) =>
    this.setServers(dissoc(id, this.listServers()));
}
