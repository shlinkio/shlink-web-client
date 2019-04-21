import { createAction, handleActions } from 'redux-actions';
import PropTypes from 'prop-types';
import { pick } from 'ramda';

/* eslint-disable padding-line-between-statements */
export const EDIT_SHORT_URL_TAGS_START = 'shlink/shortUrlTags/EDIT_SHORT_URL_TAGS_START';
export const EDIT_SHORT_URL_TAGS_ERROR = 'shlink/shortUrlTags/EDIT_SHORT_URL_TAGS_ERROR';
export const EDIT_SHORT_URL_TAGS = 'shlink/shortUrlTags/EDIT_SHORT_URL_TAGS';
export const RESET_EDIT_SHORT_URL_TAGS = 'shlink/shortUrlTags/RESET_EDIT_SHORT_URL_TAGS';
export const SHORT_URL_TAGS_EDITED = 'shlink/shortUrlTags/SHORT_URL_TAGS_EDITED';
/* eslint-enable padding-line-between-statements */

export const shortUrlTagsType = PropTypes.shape({
  shortCode: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  saving: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
});

const initialState = {
  shortCode: null,
  tags: [],
  saving: false,
  error: false,
};

export default handleActions({
  [EDIT_SHORT_URL_TAGS_START]: (state) => ({ ...state, saving: true, error: false }),
  [EDIT_SHORT_URL_TAGS_ERROR]: (state) => ({ ...state, saving: false, error: true }),
  [EDIT_SHORT_URL_TAGS]: (state, action) => ({ ...pick([ 'shortCode', 'tags' ], action), saving: false, error: false }),
  [RESET_EDIT_SHORT_URL_TAGS]: () => initialState,
}, initialState);

export const editShortUrlTags = (buildShlinkApiClient) => (shortCode, tags) => async (dispatch, getState) => {
  dispatch({ type: EDIT_SHORT_URL_TAGS_START });
  const { updateShortUrlTags } = await buildShlinkApiClient(getState);

  try {
    const normalizedTags = await updateShortUrlTags(shortCode, tags);

    dispatch({ tags: normalizedTags, shortCode, type: EDIT_SHORT_URL_TAGS });
  } catch (e) {
    dispatch({ type: EDIT_SHORT_URL_TAGS_ERROR });

    throw e;
  }
};

export const resetShortUrlsTags = createAction(RESET_EDIT_SHORT_URL_TAGS);

export const shortUrlTagsEdited = (shortCode, tags) => ({
  tags,
  shortCode,
  type: SHORT_URL_TAGS_EDITED,
});
