import Storage from '../../utils/Storage';
import { assoc, dissoc, reduce } from 'ramda';

const SERVERS_STORAGE_KEY = 'servers';

export class ServersService {
  constructor(storage) {
    this.storage = storage;
  }

  listServers = () => this.storage.get(SERVERS_STORAGE_KEY) || {};

  findServerById = serverId => this.listServers()[serverId];

  createServer = server => this.createServers([server]);

  createServers = servers => {
    const allServers = reduce(
      (serversObj, server) => assoc(server.id, server, serversObj),
      this.listServers(),
      servers
    );
    this.storage.set(SERVERS_STORAGE_KEY, allServers);
  };

  deleteServer = server =>
    this.storage.set(
      SERVERS_STORAGE_KEY,
      dissoc(server.id, this.listServers())
    );
}

const serversService = new ServersService(Storage);
export default serversService;
