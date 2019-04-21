import { handleActions } from 'redux-actions';
import PropTypes from 'prop-types';
import { shortUrlType } from '../../short-urls/reducers/shortUrlsList';

/* eslint-disable padding-line-between-statements */
export const GET_SHORT_URL_DETAIL_START = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL_START';
export const GET_SHORT_URL_DETAIL_ERROR = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL_ERROR';
export const GET_SHORT_URL_DETAIL = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL';
/* eslint-enable padding-line-between-statements */

export const shortUrlDetailType = PropTypes.shape({
  shortUrl: shortUrlType,
  loading: PropTypes.bool,
  error: PropTypes.bool,
});

const initialState = {
  shortUrl: {},
  loading: false,
  error: false,
};

export default handleActions({
  [GET_SHORT_URL_DETAIL_START]: (state) => ({ ...state, loading: true }),
  [GET_SHORT_URL_DETAIL_ERROR]: (state) => ({ ...state, loading: false, error: true }),
  [GET_SHORT_URL_DETAIL]: (state, { shortUrl }) => ({ shortUrl, loading: false, error: false }),
}, initialState);

export const getShortUrlDetail = (buildShlinkApiClient) => (shortCode) => async (dispatch, getState) => {
  dispatch({ type: GET_SHORT_URL_DETAIL_START });

  const { getShortUrl } = await buildShlinkApiClient(getState);

  try {
    const shortUrl = await getShortUrl(shortCode);

    dispatch({ shortUrl, type: GET_SHORT_URL_DETAIL });
  } catch (e) {
    dispatch({ type: GET_SHORT_URL_DETAIL_ERROR });
  }
};
