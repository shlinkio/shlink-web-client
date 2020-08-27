import { pick } from 'ramda';
import { Action, Dispatch } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import { ShlinkApiClientBuilder } from '../../utils/services/types';
import ColorGenerator from '../../utils/services/ColorGenerator';

/* eslint-disable padding-line-between-statements */
export const EDIT_TAG_START = 'shlink/editTag/EDIT_TAG_START';
export const EDIT_TAG_ERROR = 'shlink/editTag/EDIT_TAG_ERROR';
export const EDIT_TAG = 'shlink/editTag/EDIT_TAG';
/* eslint-enable padding-line-between-statements */

export const TAG_EDITED = 'shlink/editTag/TAG_EDITED';

export interface TagEdition {
  oldName: string;
  newName: string;
  editing: boolean;
  error: boolean;
}

export interface EditTagAction extends Action<string> {
  oldName: string;
  newName: string;
  color: string;
}

const initialState: TagEdition = {
  oldName: '',
  newName: '',
  editing: false,
  error: false,
};

export default buildReducer<TagEdition, EditTagAction>({
  [EDIT_TAG_START]: (state) => ({ ...state, editing: true, error: false }),
  [EDIT_TAG_ERROR]: (state) => ({ ...state, editing: false, error: true }),
  [EDIT_TAG]: (_, action) => ({
    ...pick([ 'oldName', 'newName' ], action),
    editing: false,
    error: false,
  }),
}, initialState);

export const editTag = (buildShlinkApiClient: ShlinkApiClientBuilder, colorGenerator: ColorGenerator) => (
  oldName: string,
  newName: string,
  color: string,
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: EDIT_TAG_START });
  const { editTag } = buildShlinkApiClient(getState);

  try {
    await editTag(oldName, newName);
    colorGenerator.setColorForKey(newName, color);
    dispatch({ type: EDIT_TAG, oldName, newName });
  } catch (e) {
    dispatch({ type: EDIT_TAG_ERROR });

    throw e;
  }
};

export const tagEdited = (oldName: string, newName: string, color: string): EditTagAction => ({
  type: TAG_EDITED,
  oldName,
  newName,
  color,
});
