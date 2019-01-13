export const FETCH_SERVERS = 'shlink/servers/FETCH_SERVERS';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case FETCH_SERVERS:
      return action.servers;
    default:
      return state;
  }
}

export const listServers = (serversService) => () => ({
  type: FETCH_SERVERS,
  servers: serversService.listServers(),
});

export const createServer = (serversService, listServers) => (server) => {
  serversService.createServer(server);

  return listServers();
};

export const deleteServer = (serversService, listServers) => (server) => {
  serversService.deleteServer(server);

  return listServers();
};

export const createServers = (serversService, listServers) => (servers) => {
  serversService.createServers(servers);

  return listServers();
};
