import { pick } from 'ramda';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ColorGenerator } from '../../utils/services/ColorGenerator';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { parseApiError } from '../../api/utils';
import { ProblemDetailsError } from '../../api/types/errors';

const EDIT_TAG = 'shlink/editTag/EDIT_TAG';
const TAG_EDITED = 'shlink/editTag/TAG_EDITED';

export interface TagEdition {
  oldName?: string;
  newName?: string;
  editing: boolean;
  edited: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export interface EditTag {
  oldName: string;
  newName: string;
  color: string;
}

export type EditTagAction = PayloadAction<EditTag>;

const initialState: TagEdition = {
  editing: false,
  edited: false,
  error: false,
};

export const tagEdited = createAction<EditTag>(TAG_EDITED);

export const tagEditReducerCreator = (buildShlinkApiClient: ShlinkApiClientBuilder, colorGenerator: ColorGenerator) => {
  const editTag = createAsyncThunk(
    EDIT_TAG,
    async ({ oldName, newName, color }: EditTag, { getState }): Promise<EditTag> => {
      await buildShlinkApiClient(getState).editTag(oldName, newName);
      colorGenerator.setColorForKey(newName, color);

      return { oldName, newName, color };
    },
  );

  const { reducer } = createSlice({
    name: 'tagEditReducer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(editTag.pending, () => ({ editing: true, edited: false, error: false }));
      builder.addCase(
        editTag.rejected,
        (_, { error }) => ({ editing: false, edited: false, error: true, errorData: parseApiError(error) }),
      );
      builder.addCase(editTag.fulfilled, (_, { payload }) => ({
        ...pick(['oldName', 'newName'], payload),
        editing: false,
        edited: true,
        error: false,
      }));
    },
  });

  return { reducer, editTag };
};
