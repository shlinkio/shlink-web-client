import { createAction, handleActions } from 'redux-actions';
import PropTypes from 'prop-types';

/* eslint-disable padding-line-between-statements */
export const EDIT_SHORT_URL_START = 'shlink/shortUrlEdition/EDIT_SHORT_URL_START';
export const EDIT_SHORT_URL_ERROR = 'shlink/shortUrlEdition/EDIT_SHORT_URL_ERROR';
export const SHORT_URL_EDITED = 'shlink/shortUrlEdition/SHORT_URL_EDITED';
export const RESET_EDIT_SHORT_URL = 'shlink/shortUrlEdition/RESET_EDIT_SHORT_URL';
/* eslint-enable padding-line-between-statements */

export const ShortUrlEditionType = PropTypes.shape({
  shortCode: PropTypes.string,
  longUrl: PropTypes.string,
  saving: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
});

const initialState = {
  shortCode: null,
  longUrl: null,
  saving: false,
  error: false,
};

export default handleActions({
  [EDIT_SHORT_URL_START]: (state) => ({ ...state, saving: true, error: false }),
  [EDIT_SHORT_URL_ERROR]: (state) => ({ ...state, saving: false, error: true }),
  [SHORT_URL_EDITED]: (state, { shortCode, longUrl }) => ({ shortCode, longUrl, saving: false, error: false }),
  [RESET_EDIT_SHORT_URL]: () => initialState,
}, initialState);

export const editShortUrl = (buildShlinkApiClient) => (shortCode, domain, longUrl) => async (dispatch, getState) => {
  dispatch({ type: EDIT_SHORT_URL_START });
  const { updateShortUrlMeta } = buildShlinkApiClient(getState);

  try {
    await updateShortUrlMeta(shortCode, domain, { longUrl });
    dispatch({ shortCode, longUrl, domain, type: SHORT_URL_EDITED });
  } catch (e) {
    dispatch({ type: EDIT_SHORT_URL_ERROR });

    throw e;
  }
};

export const resetShortUrlEdition = createAction(RESET_EDIT_SHORT_URL);
