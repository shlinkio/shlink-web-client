import { pick } from 'ramda';
import { Action, Dispatch } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import ColorGenerator from '../../utils/services/ColorGenerator';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { ProblemDetailsError } from '../../api/types';
import { parseApiError } from '../../api/utils';

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
  errorData?: ProblemDetailsError;
}

export interface EditTagAction extends Action<string> {
  oldName: string;
  newName: string;
  color: string;
}

export interface EditTagFailedAction extends Action<string> {
  errorData?: ProblemDetailsError;
}

const initialState: TagEdition = {
  oldName: '',
  newName: '',
  editing: false,
  error: false,
};

export default buildReducer<TagEdition, EditTagAction & EditTagFailedAction>({
  [EDIT_TAG_START]: (state) => ({ ...state, editing: true, error: false }),
  [EDIT_TAG_ERROR]: (state, { errorData }) => ({ ...state, editing: false, error: true, errorData }),
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
    dispatch<EditTagFailedAction>({ type: EDIT_TAG_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};

export const tagEdited = (oldName: string, newName: string, color: string): EditTagAction => ({
  type: TAG_EDITED,
  oldName,
  newName,
  color,
});
