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

// FIXME listServers action should be injected and not directly invoked
export const createServer = (serversService) => (server) => {
  serversService.createServer(server);

  return listServers(serversService)();
};

// FIXME listServers action should be injected and not directly invoked
export const deleteServer = (serversService) => (server) => {
  serversService.deleteServer(server);

  return listServers(serversService)();
};

// FIXME listServers action should be injected and not directly invoked
export const createServers = (serversService) => (servers) => {
  serversService.createServers(servers);

  return listServers(serversService)();
};
