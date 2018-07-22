import ServersService from '../../servers/services';
import ShlinkApiClient from '../../api/ShlinkApiClient';

export const LIST_SHORT_URLS_START = 'shlink/shortUrlsList/LIST_SHORT_URLS_START';
export const LIST_SHORT_URLS = 'shlink/shortUrlsList/LIST_SHORT_URLS';
export const UPDATE_SHORT_URLS_LIST = 'shlink/shortUrlsList/UPDATE_SHORT_URLS_LIST';

const initialState = {
  shortUrls: [],
  loading: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LIST_SHORT_URLS_START:
      return { ...state, loading: true };
    case LIST_SHORT_URLS:
    case UPDATE_SHORT_URLS_LIST:
      return {
        loading: false,
        shortUrls: action.shortUrls
      };
    default:
      return state;
  }
}

export const listShortUrls = (serverId, params = {}) => {
  return async dispatch => {
    dispatch({ type: LIST_SHORT_URLS_START });
    const selectedServer = ServersService.findServerById(serverId);

    ShlinkApiClient.setConfig(selectedServer);
    const shortUrls = await ShlinkApiClient.listShortUrls(params);
    dispatch({ type: LIST_SHORT_URLS, shortUrls, selectedServer, params });
  };
};

export const updateShortUrlsList = (params = {}) => {
  return async dispatch => {
    dispatch({ type: LIST_SHORT_URLS_START });

    const shortUrls = await ShlinkApiClient.listShortUrls(params);
    dispatch({ type: UPDATE_SHORT_URLS_LIST, shortUrls, params });
  };
};
