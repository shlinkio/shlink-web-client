import { createAction, createSlice } from '@reduxjs/toolkit';
import type { ShlinkApiClient } from '../../../api/services/ShlinkApiClient';
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

export const tagDeleteReducerCreator = (apiClient: ShlinkApiClient) => {
  const deleteTag = createAsyncThunk(`${REDUCER_PREFIX}/deleteTag`, async (tag: string): Promise<void> => {
    await apiClient.deleteTags([tag]);
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
