import PropTypes from 'prop-types';
import { createAction, handleActions } from 'redux-actions';

/* eslint-disable padding-line-between-statements */
export const CREATE_SHORT_URL_START = 'shlink/createShortUrl/CREATE_SHORT_URL_START';
export const CREATE_SHORT_URL_ERROR = 'shlink/createShortUrl/CREATE_SHORT_URL_ERROR';
export const CREATE_SHORT_URL = 'shlink/createShortUrl/CREATE_SHORT_URL';
export const RESET_CREATE_SHORT_URL = 'shlink/createShortUrl/RESET_CREATE_SHORT_URL';
/* eslint-enable padding-line-between-statements */

export const createShortUrlResultType = PropTypes.shape({
  result: PropTypes.shape({
    shortUrl: PropTypes.string,
  }),
  saving: PropTypes.bool,
  error: PropTypes.bool,
});

const initialState = {
  result: null,
  saving: false,
  error: false,
};

export default handleActions({
  [CREATE_SHORT_URL_START]: (state) => ({ ...state, saving: true, error: false }),
  [CREATE_SHORT_URL_ERROR]: (state) => ({ ...state, saving: false, error: true }),
  [CREATE_SHORT_URL]: (state, { result }) => ({ result, saving: false, error: false }),
  [RESET_CREATE_SHORT_URL]: () => initialState,
}, initialState);

export const createShortUrl = (buildShlinkApiClient) => (data) => async (dispatch, getState) => {
  dispatch({ type: CREATE_SHORT_URL_START });
  const { createShortUrl } = buildShlinkApiClient(getState);

  try {
    const result = await createShortUrl(data);

    dispatch({ type: CREATE_SHORT_URL, result });
  } catch (e) {
    dispatch({ type: CREATE_SHORT_URL_ERROR });

    throw e;
  }
};

export const resetCreateShortUrl = createAction(RESET_CREATE_SHORT_URL);
