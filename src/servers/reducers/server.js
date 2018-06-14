import ServersService from '../services';

const FETCH_SERVERS = 'shlink/FETCH_SERVERS';
const CREATE_SERVER = 'shlink/CREATE_SERVER';

export default function serversReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_SERVERS:
      return action.servers;
    case CREATE_SERVER:
      return [ ...state, action.server ];
  }

  return state;
}

export const listServers = () => {
  return {
    type: FETCH_SERVERS,
    servers: ServersService.listServers(),
  };
};
