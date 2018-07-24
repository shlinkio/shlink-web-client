import ShlinkApiClient from '../../api/ShlinkApiClient';
import ServersService from '../../servers/services';

const SELECT_SERVER = 'shlink/selectedServer/SELECT_SERVER';
const RESET_SELECTED_SERVER = 'shlink/selectedServer/RESET_SELECTED_SERVER';

export default function reducer(state = null, action) {
  switch (action.type) {
    case SELECT_SERVER:
      return action.selectedServer;
    case RESET_SELECTED_SERVER:
      return null;
    default:
      return state;
  }
}

export const resetSelectedServer = () => ({ type: RESET_SELECTED_SERVER });

export const selectServer = serverId => {
  const selectedServer = ServersService.findServerById(serverId);
  ShlinkApiClient.setConfig(selectedServer);

  return {
    type: SELECT_SERVER,
    selectedServer
  }
};
