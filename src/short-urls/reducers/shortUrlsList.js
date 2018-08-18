import ShlinkApiClient from '../../api/ShlinkApiClient';
import { SHORT_URL_TAGS_EDITED } from './shortUrlTags';
import { assoc, assocPath } from 'ramda';

const LIST_SHORT_URLS_START = 'shlink/shortUrlsList/LIST_SHORT_URLS_START';
const LIST_SHORT_URLS_ERROR = 'shlink/shortUrlsList/LIST_SHORT_URLS_ERROR';
export const LIST_SHORT_URLS = 'shlink/shortUrlsList/LIST_SHORT_URLS';

const initialState = {
  shortUrls: {},
  loading: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LIST_SHORT_URLS_START:
      return { ...state, loading: true, error: false };
    case LIST_SHORT_URLS:
      return {
        loading: false,
        error: false,
        shortUrls: action.shortUrls
      };
    case LIST_SHORT_URLS_ERROR:
      return {
        loading: false,
        error: true,
        shortUrls: []
      };
    case SHORT_URL_TAGS_EDITED:
      const { data } = state.shortUrls;
      return assocPath(['shortUrls', 'data'], data.map(shortUrl =>
        shortUrl.shortCode === action.shortCode
          ? assoc('tags', action.tags, shortUrl)
          : shortUrl
      ), state);
    default:
      return state;
  }
}

export const _listShortUrls = (ShlinkApiClient, params = {}) => async dispatch => {
  dispatch({ type: LIST_SHORT_URLS_START });

  try {
    const shortUrls = await ShlinkApiClient.listShortUrls(params);
    dispatch({ type: LIST_SHORT_URLS, shortUrls, params });
  } catch (e) {
    dispatch({ type: LIST_SHORT_URLS_ERROR, params });
  }
};
export const listShortUrls = (params = {}) => _listShortUrls(ShlinkApiClient, params);
