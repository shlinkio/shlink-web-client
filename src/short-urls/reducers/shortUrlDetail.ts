import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShortUrl, ShortUrlIdentifier } from '../data';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { shortUrlMatches } from '../helpers';
import { parseApiError } from '../../api/utils';
import { ProblemDetailsError } from '../../api/types/errors';

const REDUCER_PREFIX = 'shlink/shortUrlDetail';

export interface ShortUrlDetail {
  shortUrl?: ShortUrl;
  loading: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export type ShortUrlDetailAction = PayloadAction<ShortUrl>;

const initialState: ShortUrlDetail = {
  loading: false,
  error: false,
};

export const shortUrlDetailReducerCreator = (buildShlinkApiClient: ShlinkApiClientBuilder) => {
  const getShortUrlDetail = createAsyncThunk(
    `${REDUCER_PREFIX}/getShortUrlDetail`,
    async ({ shortCode, domain }: ShortUrlIdentifier, { getState }): Promise<ShortUrl> => {
      const { shortUrlsList } = getState();
      const alreadyLoaded = shortUrlsList?.shortUrls?.data.find((url) => shortUrlMatches(url, shortCode, domain));

      return alreadyLoaded ?? await buildShlinkApiClient(getState).getShortUrl(shortCode, domain);
    },
  );

  const { reducer } = createSlice({
    name: REDUCER_PREFIX,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getShortUrlDetail.pending, () => ({ loading: true, error: false }));
      builder.addCase(getShortUrlDetail.rejected, (_, { error }) => (
        { loading: false, error: true, errorData: parseApiError(error) }
      ));
      builder.addCase(getShortUrlDetail.fulfilled, (_, { payload: shortUrl }) => ({ ...initialState, shortUrl }));
    },
  });

  return { reducer, getShortUrlDetail };
};
