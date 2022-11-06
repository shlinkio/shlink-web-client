import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { OptionalString } from '../../utils/utils';
import { EditShortUrlData, ShortUrl } from '../data';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { parseApiError } from '../../api/utils';
import { ProblemDetailsError } from '../../api/types/errors';

export const SHORT_URL_EDITED = 'shlink/shortUrlEdition/SHORT_URL_EDITED';

export interface ShortUrlEdition {
  shortUrl?: ShortUrl;
  saving: boolean;
  error: boolean;
  saved: boolean;
  errorData?: ProblemDetailsError;
}

export interface EditShortUrl {
  shortCode: string;
  domain?: OptionalString;
  data: EditShortUrlData;
}

export type ShortUrlEditedAction = PayloadAction<ShortUrl>;

const initialState: ShortUrlEdition = {
  saving: false,
  saved: false,
  error: false,
};

export const shortUrlEditionReducerCreator = (buildShlinkApiClient: ShlinkApiClientBuilder) => {
  const editShortUrl = createAsyncThunk(
    SHORT_URL_EDITED,
    ({ shortCode, domain, data }: EditShortUrl, { getState }): Promise<ShortUrl> => {
      const { updateShortUrl } = buildShlinkApiClient(getState);
      return updateShortUrl(shortCode, domain, data as any); // FIXME parse dates
    },
  );

  const { reducer } = createSlice({
    name: 'shortUrlEditionReducer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(editShortUrl.pending, (state) => ({ ...state, saving: true, error: false, saved: false }));
      builder.addCase(
        editShortUrl.rejected,
        (state, { error }) => ({ ...state, saving: false, error: true, saved: false, errorData: parseApiError(error) }),
      );
      builder.addCase(
        editShortUrl.fulfilled,
        (_, { payload: shortUrl }) => ({ shortUrl, saving: false, error: false, saved: true }),
      );
    },
  });

  return { reducer, editShortUrl };
};
