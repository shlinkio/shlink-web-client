import ServersService from '../services/ServersService';
import { curry } from 'ramda';

export const FETCH_SERVERS = 'shlink/servers/FETCH_SERVERS';
export const CREATE_SERVER = 'shlink/servers/CREATE_SERVER';
export const DELETE_SERVER = 'shlink/servers/DELETE_SERVER';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case FETCH_SERVERS:
    case DELETE_SERVER:
      return action.servers;
    case CREATE_SERVER:
      const server = action.server;
      return { ...state, [server.id]: server };
    default:
      return state;
  }
}

export const _listServers = ServersService => ({
  type: FETCH_SERVERS,
  servers: ServersService.listServers(),
});
export const listServers = () => _listServers(ServersService);

export const _createServer = (ServersService, server) => {
  ServersService.createServer(server);
  return _listServers(ServersService);
};
export const createServer = curry(_createServer)(ServersService);

export const _deleteServer = (ServersService, server) => {
  ServersService.deleteServer(server);
  return _listServers(ServersService);
};
export const deleteServer = curry(_deleteServer)(ServersService);
