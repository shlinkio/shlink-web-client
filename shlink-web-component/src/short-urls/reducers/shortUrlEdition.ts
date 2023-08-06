import { createSlice } from '@reduxjs/toolkit';
import type { ProblemDetailsError, ShlinkApiClient, ShlinkShortUrlData } from '../../api-contract';
import { parseApiError } from '../../api-contract/utils';
import { createAsyncThunk } from '../../utils/redux';
import type { ShlinkShortUrl, ShortUrlIdentifier } from '../data';

const REDUCER_PREFIX = 'shlink/shortUrlEdition';

export interface ShortUrlEdition {
  shortUrl?: ShlinkShortUrl;
  saving: boolean;
  saved: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export interface EditShortUrl extends ShortUrlIdentifier {
  data: ShlinkShortUrlData;
}

const initialState: ShortUrlEdition = {
  saving: false,
  saved: false,
  error: false,
};

export const editShortUrl = (apiClientFactory: () => ShlinkApiClient) => createAsyncThunk(
  `${REDUCER_PREFIX}/editShortUrl`,
  ({ shortCode, domain, data }: EditShortUrl): Promise<ShlinkShortUrl> =>
    apiClientFactory().updateShortUrl(shortCode, domain, data as any) // TODO parse dates
  ,
);

export const shortUrlEditionReducerCreator = (editShortUrlThunk: ReturnType<typeof editShortUrl>) => createSlice({
  name: REDUCER_PREFIX,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(editShortUrlThunk.pending, (state) => ({ ...state, saving: true, error: false, saved: false }));
    builder.addCase(
      editShortUrlThunk.rejected,
      (state, { error }) => ({ ...state, saving: false, error: true, saved: false, errorData: parseApiError(error) }),
    );
    builder.addCase(
      editShortUrlThunk.fulfilled,
      (_, { payload: shortUrl }) => ({ shortUrl, saving: false, error: false, saved: true }),
    );
  },
});
