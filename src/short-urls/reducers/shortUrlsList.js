import { LIST_SHORT_URLS, UPDATE_SHORT_URLS_LIST } from '../../reducers/types';
import ServersService from '../../servers/services';
import ShlinkApiClient from '../../api/ShlinkApiClient';

export default function shortUrlsListReducer(state = [], action) {
  switch (action.type) {
    case LIST_SHORT_URLS:
    case UPDATE_SHORT_URLS_LIST:
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

export const updateShortUrlsList = (params = {}) => {
  return async dispatch => {
    const shortUrls = await ShlinkApiClient.listShortUrls(params);
    dispatch({ type: UPDATE_SHORT_URLS_LIST, shortUrls, params });
  };
};
