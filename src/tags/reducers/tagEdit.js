import { pick } from 'ramda';
import { handleActions } from 'redux-actions';

/* eslint-disable padding-line-between-statements */
export const EDIT_TAG_START = 'shlink/editTag/EDIT_TAG_START';
export const EDIT_TAG_ERROR = 'shlink/editTag/EDIT_TAG_ERROR';
export const EDIT_TAG = 'shlink/editTag/EDIT_TAG';
/* eslint-enable padding-line-between-statements */

export const TAG_EDITED = 'shlink/editTag/TAG_EDITED';

const initialState = {
  oldName: '',
  newName: '',
  editing: false,
  error: false,
};

export default handleActions({
  [EDIT_TAG_START]: (state) => ({ ...state, editing: true, error: false }),
  [EDIT_TAG_ERROR]: (state) => ({ ...state, editing: false, error: true }),
  [EDIT_TAG]: (state, action) => ({
    ...pick([ 'oldName', 'newName' ], action),
    editing: false,
    error: false,
  }),
}, initialState);

export const editTag = (buildShlinkApiClient, colorGenerator) => (oldName, newName, color) => async (
  dispatch,
  getState
) => {
  dispatch({ type: EDIT_TAG_START });

  const { editTag } = await buildShlinkApiClient(getState);

  try {
    await editTag(oldName, newName);
    colorGenerator.setColorForKey(newName, color);
    dispatch({ type: EDIT_TAG, oldName, newName });
  } catch (e) {
    dispatch({ type: EDIT_TAG_ERROR });

    throw e;
  }
};

export const tagEdited = (oldName, newName, color) => ({
  type: TAG_EDITED,
  oldName,
  newName,
  color,
});
