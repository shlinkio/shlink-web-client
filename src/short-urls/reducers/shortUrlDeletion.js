import PropTypes from 'prop-types';

/* eslint-disable padding-line-between-statements, newline-after-var */
const DELETE_SHORT_URL_START = 'shlink/deleteShortUrl/DELETE_SHORT_URL_START';
const DELETE_SHORT_URL_ERROR = 'shlink/deleteShortUrl/DELETE_SHORT_URL_ERROR';
const DELETE_SHORT_URL = 'shlink/deleteShortUrl/DELETE_SHORT_URL';
const RESET_DELETE_SHORT_URL = 'shlink/deleteShortUrl/RESET_DELETE_SHORT_URL';
export const SHORT_URL_DELETED = 'shlink/deleteShortUrl/SHORT_URL_DELETED';
/* eslint-enable padding-line-between-statements, newline-after-var */

export const shortUrlDeletionType = PropTypes.shape({
  shortCode: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  errorData: PropTypes.shape({
    error: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
});

const defaultState = {
  shortCode: '',
  loading: false,
  error: false,
  errorData: {},
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case DELETE_SHORT_URL_START:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case DELETE_SHORT_URL_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
        errorData: action.errorData,
      };
    case DELETE_SHORT_URL:
      return {
        ...state,
        shortCode: action.shortCode,
        loading: false,
        error: false,
      };
    case RESET_DELETE_SHORT_URL:
      return defaultState;
    default:
      return state;
  }
}

export const deleteShortUrl = (buildShlinkApiClient) => (shortCode) => async (dispatch, getState) => {
  dispatch({ type: DELETE_SHORT_URL_START });

  const { selectedServer } = getState();
  const shlinkApiClient = buildShlinkApiClient(selectedServer);

  try {
    await shlinkApiClient.deleteShortUrl(shortCode);
    dispatch({ type: DELETE_SHORT_URL, shortCode });
  } catch (e) {
    dispatch({ type: DELETE_SHORT_URL_ERROR, errorData: e.response.data });

    throw e;
  }
};

export const resetDeleteShortUrl = () => ({ type: RESET_DELETE_SHORT_URL });

export const shortUrlDeleted = (shortCode) => ({ type: SHORT_URL_DELETED, shortCode });
