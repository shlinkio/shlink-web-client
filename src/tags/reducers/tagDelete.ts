import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { parseApiError } from '../../api/utils';
import { ProblemDetailsError } from '../../api/types/errors';

const DELETE_TAG = 'shlink/deleteTag/DELETE_TAG';
const TAG_DELETED = 'shlink/deleteTag/TAG_DELETED';

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

export const tagDeleted = createAction<string>(TAG_DELETED);

export const tagDeleteReducerCreator = (buildShlinkApiClient: ShlinkApiClientBuilder) => {
  const deleteTag = createAsyncThunk(DELETE_TAG, async (tag: string, { getState }): Promise<void> => {
    const { deleteTags } = buildShlinkApiClient(getState);
    await deleteTags([tag]);
  });

  const { reducer } = createSlice({
    name: 'tagDeleteReducer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(deleteTag.pending, () => ({ deleting: true, deleted: false, error: false }));
      builder.addCase(
        deleteTag.rejected,
        (_, { error }) => ({ deleting: false, deleted: false, error: true, errorData: parseApiError(error) }),
      );
      builder.addCase(deleteTag.fulfilled, () => ({ deleting: false, deleted: true, error: false }));
    },
  });

  return { reducer, deleteTag };
};
