import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShortUrl, ShortUrlData } from '../data';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { parseApiError } from '../../api/utils';
import { ProblemDetailsError } from '../../api/types/errors';

export const CREATE_SHORT_URL = 'shlink/createShortUrl/CREATE_SHORT_URL';

export interface ShortUrlCreation {
  result: ShortUrl | null;
  saving: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export type CreateShortUrlAction = PayloadAction<ShortUrl>;

const initialState: ShortUrlCreation = {
  result: null,
  saving: false,
  error: false,
};

export const shortUrlCreationReducerCreator = (buildShlinkApiClient: ShlinkApiClientBuilder) => {
  const createShortUrl = createAsyncThunk(CREATE_SHORT_URL, (data: ShortUrlData, { getState }): Promise<ShortUrl> => {
    const { createShortUrl: shlinkCreateShortUrl } = buildShlinkApiClient(getState);
    return shlinkCreateShortUrl(data);
  });

  const { reducer, actions } = createSlice({
    name: 'shortUrlCreationReducer',
    initialState,
    reducers: {
      resetCreateShortUrl: () => initialState,
    },
    extraReducers: (builder) => {
      builder.addCase(createShortUrl.pending, (state) => ({ ...state, saving: true, error: false }));
      builder.addCase(
        createShortUrl.rejected,
        (state, { error }) => ({ ...state, saving: false, error: true, errorData: parseApiError(error) }),
      );
      builder.addCase(createShortUrl.fulfilled, (_, { payload: result }) => ({ result, saving: false, error: false }));
    },
  });

  const { resetCreateShortUrl } = actions;

  return {
    reducer,
    createShortUrl,
    resetCreateShortUrl,
  };
};
