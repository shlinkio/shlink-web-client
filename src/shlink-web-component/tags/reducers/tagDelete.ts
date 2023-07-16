import { createAction, createSlice } from '@reduxjs/toolkit';
import type { ShlinkApiClientBuilder } from '../../../api/services/ShlinkApiClientBuilder';
import type { ProblemDetailsError } from '../../../api/types/errors';
import { parseApiError } from '../../../api/utils';
import { createAsyncThunk } from '../../../utils/helpers/redux';

const REDUCER_PREFIX = 'shlink/tagDelete';

export interface TagDeletion {
  deleting: boolean;
  deleted: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

const initialState: TagDeletion = {
  deleting: false,
  deleted: false,
  error: false,
};

export const tagDeleted = createAction<string>(`${REDUCER_PREFIX}/tagDeleted`);

export const tagDeleteReducerCreator = (buildShlinkApiClient: ShlinkApiClientBuilder) => {
  const deleteTag = createAsyncThunk(`${REDUCER_PREFIX}/deleteTag`, async (tag: string, { getState }): Promise<void> => {
    const { deleteTags } = buildShlinkApiClient(getState);
    await deleteTags([tag]);
  });

  const { reducer } = createSlice({
    name: REDUCER_PREFIX,
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
