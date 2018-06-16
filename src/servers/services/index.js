import Storage from '../../utils/Storage';

export class ServersService {
  constructor(storage) {
    this.storage = storage;
  }

  listServers = () => {
    return this.storage.get('servers');
  };

  findServerById = serverId => {
    const servers = this.listServers();
    return servers[serverId];
  }
}

export default new ServersService(Storage);
