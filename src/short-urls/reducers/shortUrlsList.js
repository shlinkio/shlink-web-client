import { handleActions } from 'redux-actions';
import { assoc, assocPath, isNil, reject } from 'ramda';
import PropTypes from 'prop-types';
import { SHORT_URL_TAGS_EDITED } from './shortUrlTags';
import { SHORT_URL_DELETED } from './shortUrlDeletion';
import { SHORT_URL_META_EDITED, shortUrlMetaType } from './shortUrlMeta';

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
  meta: shortUrlMetaType,
  tags: PropTypes.arrayOf(PropTypes.string),
  domain: PropTypes.string,
});

const initialState = {
  shortUrls: {},
  loading: true,
  error: false,
};

const shortUrlMatches = (shortUrl, shortCode, domain) => {
  if (isNil(domain)) {
    return shortUrl.shortCode === shortCode && !shortUrl.domain;
  }

  return shortUrl.shortCode === shortCode && shortUrl.domain === domain;
};

const setPropFromActionOnMatchingShortUrl = (prop) => (state, { shortCode, domain, [prop]: propValue }) => assocPath(
  [ 'shortUrls', 'data' ],
  state.shortUrls.data.map(
    (shortUrl) => shortUrlMatches(shortUrl, shortCode, domain) ? assoc(prop, propValue, shortUrl) : shortUrl
  ),
  state
);

export default handleActions({
  [LIST_SHORT_URLS_START]: (state) => ({ ...state, loading: true, error: false }),
  [LIST_SHORT_URLS]: (state, { shortUrls }) => ({ loading: false, error: false, shortUrls }),
  [LIST_SHORT_URLS_ERROR]: () => ({ loading: false, error: true, shortUrls: {} }),
  [SHORT_URL_DELETED]: (state, { shortCode, domain }) => assocPath(
    [ 'shortUrls', 'data' ],
    reject((shortUrl) => shortUrlMatches(shortUrl, shortCode, domain), state.shortUrls.data),
    state,
  ),
  [SHORT_URL_TAGS_EDITED]: setPropFromActionOnMatchingShortUrl('tags'),
  [SHORT_URL_META_EDITED]: setPropFromActionOnMatchingShortUrl('meta'),
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
