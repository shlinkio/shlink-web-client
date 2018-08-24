import serversService from '../services/ServersService';
import { curry } from 'ramda';

export const FETCH_SERVERS = 'shlink/servers/FETCH_SERVERS';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case FETCH_SERVERS:
      return action.servers;
    default:
      return state;
  }
}

export const _listServers = serversService => ({
  type: FETCH_SERVERS,
  servers: serversService.listServers(),
});
export const listServers = () => _listServers(serversService);

export const _createServer = (serversService, server) => {
  serversService.createServer(server);
  return _listServers(serversService);
};
export const createServer = curry(_createServer)(serversService);

export const _deleteServer = (serversService, server) => {
  serversService.deleteServer(server);
  return _listServers(serversService);
};
export const deleteServer = curry(_deleteServer)(serversService);

export const _createServers = (serversService, servers) => {
  serversService.createServers(servers);
  return _listServers(serversService);
};
export const createServers = curry(_createServers)(serversService);
