import ServersService from '../services';
import { LOAD_SERVER } from '../../reducers/types';

export default function selectedServerReducer(state = null, action) {
  switch (action.type) {
    case LOAD_SERVER:
      return action.selectedServer;
    default:
      return state;
  }
}

export const loadServer = serverId => {
  return {
    type: LOAD_SERVER,
    selectedServer: ServersService.findServerById(serverId),
  };
};
