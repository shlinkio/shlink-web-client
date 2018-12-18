import PropTypes from 'prop-types';
import { shortUrlType } from '../../short-urls/reducers/shortUrlsList';

/* eslint-disable padding-line-between-statements, newline-after-var */
export const GET_SHORT_URL_DETAIL_START = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL_START';
export const GET_SHORT_URL_DETAIL_ERROR = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL_ERROR';
export const GET_SHORT_URL_DETAIL = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL';
/* eslint-enable padding-line-between-statements, newline-after-var */

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

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_SHORT_URL_DETAIL_START:
      return {
        ...state,
        loading: true,
      };
    case GET_SHORT_URL_DETAIL_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    case GET_SHORT_URL_DETAIL:
      return {
        shortUrl: action.shortUrl,
        loading: false,
        error: false,
      };
    default:
      return state;
  }
}

export const getShortUrlDetail = (buildShlinkApiClient) => (shortCode) => async (dispatch, getState) => {
  dispatch({ type: GET_SHORT_URL_DETAIL_START });

  const { selectedServer } = getState();
  const shlinkApiClient = buildShlinkApiClient(selectedServer);

  try {
    const shortUrl = await shlinkApiClient.getShortUrl(shortCode);

    dispatch({ shortUrl, type: GET_SHORT_URL_DETAIL });
  } catch (e) {
    dispatch({ type: GET_SHORT_URL_DETAIL_ERROR });
  }
};
