import { assoc, assocPath, reject } from 'ramda';
import PropTypes from 'prop-types';
import { SHORT_URL_TAGS_EDITED } from './shortUrlTags';
import { SHORT_URL_DELETED } from './shortUrlDeletion';

/* eslint-disable padding-line-between-statements, newline-after-var */
const LIST_SHORT_URLS_START = 'shlink/shortUrlsList/LIST_SHORT_URLS_START';
const LIST_SHORT_URLS_ERROR = 'shlink/shortUrlsList/LIST_SHORT_URLS_ERROR';
export const LIST_SHORT_URLS = 'shlink/shortUrlsList/LIST_SHORT_URLS';
/* eslint-enable padding-line-between-statements, newline-after-var */

export const shortUrlType = PropTypes.shape({
  tags: PropTypes.arrayOf(PropTypes.string),
  shortCode: PropTypes.string,
  originalUrl: PropTypes.string,
});

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
        shortUrls: action.shortUrls,
      };
    case LIST_SHORT_URLS_ERROR:
      return {
        loading: false,
        error: true,
        shortUrls: [],
      };
    case SHORT_URL_TAGS_EDITED:
      const { data } = state.shortUrls;

      return assocPath([ 'shortUrls', 'data' ], data.map((shortUrl) =>
        shortUrl.shortCode === action.shortCode
          ? assoc('tags', action.tags, shortUrl)
          : shortUrl), state);
    case SHORT_URL_DELETED:
      return assocPath(
        [ 'shortUrls', 'data' ],
        reject((shortUrl) => shortUrl.shortCode === action.shortCode, state.shortUrls.data),
        state,
      );
    default:
      return state;
  }
}

export const listShortUrls = (buildShlinkApiClient) => (params = {}) => async (dispatch, getState) => {
  dispatch({ type: LIST_SHORT_URLS_START });

  const { selectedServer = {} } = getState();
  const shlinkApiClient = buildShlinkApiClient(selectedServer);

  try {
    const shortUrls = await shlinkApiClient.listShortUrls(params);

    dispatch({ type: LIST_SHORT_URLS, shortUrls, params });
  } catch (e) {
    dispatch({ type: LIST_SHORT_URLS_ERROR, params });
  }
};
