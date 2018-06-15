import ServersService from '../services';
import { FETCH_SERVERS, CREATE_SERVER } from '../../reducers/types';

export default function serversReducer(state = {}, action) {
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
