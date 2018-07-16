import Storage from '../../utils/Storage';
import { assoc } from 'ramda';
import { v4 as uuid } from 'uuid';

const SERVERS_STORAGE_KEY = 'servers';

export class ServersService {
  constructor(storage) {
    this.storage = storage;
  }

  listServers = () => {
    return this.storage.get(SERVERS_STORAGE_KEY);
  };

  findServerById = serverId => {
    const servers = this.listServers();
    return servers[serverId];
  };

  createServer = server => {
    const servers = this.listServers();
    server = assoc('id', uuid(), server);
    servers[server.id] = server;
    this.storage.set(SERVERS_STORAGE_KEY, servers);
  };
}

export default new ServersService(Storage);
