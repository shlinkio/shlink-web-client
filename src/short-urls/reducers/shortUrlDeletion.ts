import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { parseApiError } from '../../api/utils';
import { ProblemDetailsError } from '../../api/types/errors';
import { ShortUrlIdentifier } from '../data';

export const SHORT_URL_DELETED = 'shlink/deleteShortUrl/SHORT_URL_DELETED';

export interface ShortUrlDeletion {
  shortCode: string;
  loading: boolean;
  deleted: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export type DeleteShortUrlAction = PayloadAction<ShortUrlIdentifier>;

const initialState: ShortUrlDeletion = {
  shortCode: '',
  loading: false,
  deleted: false,
  error: false,
};

export const shortUrlDeletionReducerCreator = (buildShlinkApiClient: ShlinkApiClientBuilder) => {
  const deleteShortUrl = createAsyncThunk(
    SHORT_URL_DELETED,
    async ({ shortCode, domain }: ShortUrlIdentifier, { getState }): Promise<ShortUrlIdentifier> => {
      const { deleteShortUrl: shlinkDeleteShortUrl } = buildShlinkApiClient(getState);
      await shlinkDeleteShortUrl(shortCode, domain);
      return { shortCode, domain };
    },
  );

  const { actions, reducer } = createSlice({
    name: 'shortUrlDeletion',
    initialState,
    reducers: {
      resetDeleteShortUrl: () => initialState,
    },
    extraReducers: (builder) => {
      builder.addCase(deleteShortUrl.pending, (state) => ({ ...state, loading: true, error: false, deleted: false }));
      builder.addCase(deleteShortUrl.rejected, (state, { error }) => (
        { ...state, errorData: parseApiError(error), loading: false, error: true, deleted: false }
      ));
      builder.addCase(deleteShortUrl.fulfilled, (state, { payload }) => (
        { ...state, shortCode: payload.shortCode, loading: false, error: false, deleted: true }
      ));
    },
  });

  const { resetDeleteShortUrl } = actions;

  return { reducer, deleteShortUrl, resetDeleteShortUrl };
};
