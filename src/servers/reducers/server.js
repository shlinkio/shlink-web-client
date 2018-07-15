import ServersService from '../services';

const FETCH_SERVERS = 'shlink/servers/FETCH_SERVERS';
const CREATE_SERVER = 'shlink/servers/CREATE_SERVER';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case FETCH_SERVERS:
      return action.servers;
    case CREATE_SERVER:
      return [ ...state, action.server ];
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
