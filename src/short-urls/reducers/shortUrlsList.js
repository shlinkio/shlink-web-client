import { handleActions } from 'redux-actions';
import { assoc, assocPath, propEq, reject } from 'ramda';
import PropTypes from 'prop-types';
import { SHORT_URL_TAGS_EDITED } from './shortUrlTags';
import { SHORT_URL_DELETED } from './shortUrlDeletion';

/* eslint-disable padding-line-between-statements */
export const LIST_SHORT_URLS_START = 'shlink/shortUrlsList/LIST_SHORT_URLS_START';
export const LIST_SHORT_URLS_ERROR = 'shlink/shortUrlsList/LIST_SHORT_URLS_ERROR';
export const LIST_SHORT_URLS = 'shlink/shortUrlsList/LIST_SHORT_URLS';
/* eslint-enable padding-line-between-statements */

export const shortUrlType = PropTypes.shape({
  shortCode: PropTypes.string,
  shortUrl: PropTypes.string,
  longUrl: PropTypes.string,
  visitsCount: PropTypes.number,
  meta: PropTypes.shape({
    validSince: PropTypes.string,
    validUntil: PropTypes.string,
    maxVisits: PropTypes.number,
  }),
  tags: PropTypes.arrayOf(PropTypes.string),
});

const initialState = {
  shortUrls: {},
  loading: true,
  error: false,
};

export default handleActions({
  [LIST_SHORT_URLS_START]: (state) => ({ ...state, loading: true, error: false }),
  [LIST_SHORT_URLS]: (state, { shortUrls }) => ({ loading: false, error: false, shortUrls }),
  [LIST_SHORT_URLS_ERROR]: () => ({ loading: false, error: true, shortUrls: {} }),
  [SHORT_URL_TAGS_EDITED]: (state, action) => { // eslint-disable-line object-shorthand
    const { data } = state.shortUrls;

    return assocPath([ 'shortUrls', 'data' ], data.map((shortUrl) =>
      shortUrl.shortCode === action.shortCode
        ? assoc('tags', action.tags, shortUrl)
        : shortUrl), state);
  },
  [SHORT_URL_DELETED]: (state, action) => assocPath(
    [ 'shortUrls', 'data' ],
    reject(propEq('shortCode', action.shortCode), state.shortUrls.data),
    state,
  ),
}, initialState);

export const listShortUrls = (buildShlinkApiClient) => (params = {}) => async (dispatch, getState) => {
  dispatch({ type: LIST_SHORT_URLS_START });

  const { listShortUrls } = await buildShlinkApiClient(getState);

  try {
    const shortUrls = await listShortUrls(params);

    dispatch({ type: LIST_SHORT_URLS, shortUrls, params });
  } catch (e) {
    dispatch({ type: LIST_SHORT_URLS_ERROR, params });
  }
};
