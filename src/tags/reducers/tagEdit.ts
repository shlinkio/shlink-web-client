import { pick } from 'ramda';
import { Action, Dispatch } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import ColorGenerator from '../../utils/services/ColorGenerator';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { ProblemDetailsError } from '../../api/types';
import { parseApiError } from '../../api/utils';
import { ApiErrorAction } from '../../api/types/actions';

export const EDIT_TAG_START = 'shlink/editTag/EDIT_TAG_START';
export const EDIT_TAG_ERROR = 'shlink/editTag/EDIT_TAG_ERROR';
export const EDIT_TAG = 'shlink/editTag/EDIT_TAG';

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

const initialState: TagEdition = {
  oldName: '',
  newName: '',
  editing: false,
  error: false,
};

export default buildReducer<TagEdition, EditTagAction & ApiErrorAction>({
  [EDIT_TAG_START]: (state) => ({ ...state, editing: true, error: false }),
  [EDIT_TAG_ERROR]: (state, { errorData }) => ({ ...state, editing: false, error: true, errorData }),
  [EDIT_TAG]: (_, action) => ({
    ...pick(['oldName', 'newName'], action),
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
  const { editTag: shlinkEditTag } = buildShlinkApiClient(getState);

  try {
    await shlinkEditTag(oldName, newName);
    colorGenerator.setColorForKey(newName, color);
    dispatch({ type: EDIT_TAG, oldName, newName });
  } catch (e: any) {
    dispatch<ApiErrorAction>({ type: EDIT_TAG_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};

export const tagEdited = (oldName: string, newName: string, color: string): EditTagAction => ({
  type: TAG_EDITED,
  oldName,
  newName,
  color,
});
