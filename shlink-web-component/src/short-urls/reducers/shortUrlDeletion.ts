import { createAction, createSlice } from '@reduxjs/toolkit';
import type { ProblemDetailsError, ShlinkApiClient } from '../../api-contract';
import { parseApiError } from '../../api-contract/utils';
import { createAsyncThunk } from '../../utils/redux';
import type { ShlinkShortUrl, ShortUrlIdentifier } from '../data';

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

export const deleteShortUrl = (apiClientFactory: () => ShlinkApiClient) => createAsyncThunk(
  `${REDUCER_PREFIX}/deleteShortUrl`,
  async ({ shortCode, domain }: ShortUrlIdentifier): Promise<ShortUrlIdentifier> => {
    await apiClientFactory().deleteShortUrl(shortCode, domain);
    return { shortCode, domain };
  },
);

export const shortUrlDeleted = createAction<ShlinkShortUrl>(`${REDUCER_PREFIX}/shortUrlDeleted`);

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
