import { curry } from 'ramda';
import shlinkApiClient from '../../api/ShlinkApiClient';
import serversService from '../../servers/services/ServersService';
import { resetShortUrlParams } from '../../short-urls/reducers/shortUrlsListParams';

const defaultState = null;

export const SELECT_SERVER = 'shlink/selectedServer/SELECT_SERVER';

export const RESET_SELECTED_SERVER = 'shlink/selectedServer/RESET_SELECTED_SERVER';

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SELECT_SERVER:
      return action.selectedServer;
    case RESET_SELECTED_SERVER:
      return defaultState;
    default:
      return state;
  }
}

export const resetSelectedServer = () => ({ type: RESET_SELECTED_SERVER });

export const _selectServer = (shlinkApiClient, serversService, serverId) => (dispatch) => {
  dispatch(resetShortUrlParams());

  const selectedServer = serversService.findServerById(serverId);

  shlinkApiClient.setConfig(selectedServer);

  dispatch({
    type: SELECT_SERVER,
    selectedServer,
  });
};

export const selectServer = curry(_selectServer)(shlinkApiClient, serversService);
