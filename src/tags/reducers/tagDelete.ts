import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { parseApiError } from '../../api/utils';
import { ApiErrorAction } from '../../api/types/actions';
import { ProblemDetailsError } from '../../api/types/errors';

export const DELETE_TAG_START = 'shlink/deleteTag/DELETE_TAG_START';
export const DELETE_TAG_ERROR = 'shlink/deleteTag/DELETE_TAG_ERROR';
export const DELETE_TAG = 'shlink/deleteTag/DELETE_TAG';
export const TAG_DELETED = 'shlink/deleteTag/TAG_DELETED';

export interface TagDeletion {
  deleting: boolean;
  deleted: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export type DeleteTagAction = PayloadAction<string>;

const initialState: TagDeletion = {
  deleting: false,
  deleted: false,
  error: false,
};

export default buildReducer<TagDeletion, ApiErrorAction>({
  [DELETE_TAG_START]: () => ({ deleting: true, deleted: false, error: false }),
  [DELETE_TAG_ERROR]: (_, { errorData }) => ({ deleting: false, deleted: false, error: true, errorData }),
  [DELETE_TAG]: () => ({ deleting: false, deleted: true, error: false }),
}, initialState);

export const deleteTag = (buildShlinkApiClient: ShlinkApiClientBuilder) => (tag: string) => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch({ type: DELETE_TAG_START });
  const { deleteTags } = buildShlinkApiClient(getState);

  try {
    await deleteTags([tag]);
    dispatch({ type: DELETE_TAG });
  } catch (e: any) {
    dispatch<ApiErrorAction>({ type: DELETE_TAG_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};

export const tagDeleted = createAction<string>(TAG_DELETED);
