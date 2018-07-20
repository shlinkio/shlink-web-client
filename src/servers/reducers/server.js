import ServersService from '../services';

const FETCH_SERVERS = 'shlink/servers/FETCH_SERVERS';
const CREATE_SERVER = 'shlink/servers/CREATE_SERVER';
const DELETE_SERVER = 'shlink/servers/DELETE_SERVER';

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

export const listServers = () => {
  return {
    type: FETCH_SERVERS,
    servers: ServersService.listServers(),
  };
};

export const createServer = server => {
  ServersService.createServer(server);
  return listServers();
};

export const deleteServer = server => {
  ServersService.deleteServer(server);
  return listServers();
};
