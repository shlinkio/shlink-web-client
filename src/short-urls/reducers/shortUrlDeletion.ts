import { createAction, createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { parseApiError } from '../../api/utils';
import { ProblemDetailsError } from '../../api/types/errors';
import { ShortUrl, ShortUrlIdentifier } from '../data';

const REDUCER_PREFIX = 'shlink/shortUrlDeletion';

export interface ShortUrlDeletion {
  shortCode: string;
  loading: boolean;
  deleted: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

const initialState: ShortUrlDeletion = {
  shortCode: '',
  loading: false,
  deleted: false,
  error: false,
};

export const deleteShortUrl = (buildShlinkApiClient: ShlinkApiClientBuilder) => createAsyncThunk(
  `${REDUCER_PREFIX}/deleteShortUrl`,
  async ({ shortCode, domain }: ShortUrlIdentifier, { getState }): Promise<ShortUrlIdentifier> => {
    const { deleteShortUrl: shlinkDeleteShortUrl } = buildShlinkApiClient(getState);
    await shlinkDeleteShortUrl(shortCode, domain);
    return { shortCode, domain };
  },
);

export const shortUrlDeleted = createAction<ShortUrl>(`${REDUCER_PREFIX}/shortUrlDeleted`);

export const shortUrlDeletionReducerCreator = (deleteShortUrlThunk: ReturnType<typeof deleteShortUrl>) => {
  const { actions, reducer } = createSlice({
    name: REDUCER_PREFIX,
    initialState,
    reducers: {
      resetDeleteShortUrl: () => initialState,
    },
    extraReducers: (builder) => {
      builder.addCase(
        deleteShortUrlThunk.pending,
        (state) => ({ ...state, loading: true, error: false, deleted: false }),
      );
      builder.addCase(deleteShortUrlThunk.rejected, (state, { error }) => (
        { ...state, errorData: parseApiError(error), loading: false, error: true, deleted: false }
      ));
      builder.addCase(deleteShortUrlThunk.fulfilled, (state, { payload }) => (
        { ...state, shortCode: payload.shortCode, loading: false, error: false, deleted: true }
      ));
    },
  });

  const { resetDeleteShortUrl } = actions;

  return { reducer, resetDeleteShortUrl };
};
