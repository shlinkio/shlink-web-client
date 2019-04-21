import { createAction, handleActions } from 'redux-actions';
import PropTypes from 'prop-types';

/* eslint-disable padding-line-between-statements */
export const DELETE_SHORT_URL_START = 'shlink/deleteShortUrl/DELETE_SHORT_URL_START';
export const DELETE_SHORT_URL_ERROR = 'shlink/deleteShortUrl/DELETE_SHORT_URL_ERROR';
export const DELETE_SHORT_URL = 'shlink/deleteShortUrl/DELETE_SHORT_URL';
export const RESET_DELETE_SHORT_URL = 'shlink/deleteShortUrl/RESET_DELETE_SHORT_URL';
export const SHORT_URL_DELETED = 'shlink/deleteShortUrl/SHORT_URL_DELETED';
/* eslint-enable padding-line-between-statements */

export const shortUrlDeletionType = PropTypes.shape({
  shortCode: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  errorData: PropTypes.shape({
    error: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
});

const initialState = {
  shortCode: '',
  loading: false,
  error: false,
  errorData: {},
};

export default handleActions({
  [DELETE_SHORT_URL_START]: (state) => ({ ...state, loading: true, error: false }),
  [DELETE_SHORT_URL_ERROR]: (state, { errorData }) => ({ ...state, errorData, loading: false, error: true }),
  [DELETE_SHORT_URL]: (state, { shortCode }) => ({ ...state, shortCode, loading: false, error: false }),
  [RESET_DELETE_SHORT_URL]: () => initialState,
}, initialState);

export const deleteShortUrl = (buildShlinkApiClient) => (shortCode) => async (dispatch, getState) => {
  dispatch({ type: DELETE_SHORT_URL_START });

  const { deleteShortUrl } = await buildShlinkApiClient(getState);

  try {
    await deleteShortUrl(shortCode);
    dispatch({ type: DELETE_SHORT_URL, shortCode });
  } catch (e) {
    dispatch({ type: DELETE_SHORT_URL_ERROR, errorData: e.response.data });

    throw e;
  }
};

export const resetDeleteShortUrl = createAction(RESET_DELETE_SHORT_URL);

export const shortUrlDeleted = (shortCode) => ({ type: SHORT_URL_DELETED, shortCode });
