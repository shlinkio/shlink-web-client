import { LIST_SHORT_URLS } from '../../reducers/types';
import ServersService from '../../servers/services';
import ShlinkApiClient from '../../api/ShlinkApiClient';

export default function shortUrlsListReducer(state = [], action) {
  switch (action.type) {
    case LIST_SHORT_URLS:
      return action.shortUrls;
    default:
      return state;
  }
}

export const listShortUrls = (serverId, params = {}) => {
  return async dispatch => {
    const selectedServer = ServersService.findServerById(serverId);

    ShlinkApiClient.setConfig(selectedServer);
    const shortUrls = await ShlinkApiClient.listShortUrls(params);
    dispatch({ type: LIST_SHORT_URLS, shortUrls, selectedServer });
  };
};
