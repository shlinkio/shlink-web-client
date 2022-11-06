import { PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import { OptionalString } from '../../utils/utils';
import { EditShortUrlData, ShortUrl } from '../data';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { parseApiError } from '../../api/utils';
import { ApiErrorAction } from '../../api/types/actions';
import { ProblemDetailsError } from '../../api/types/errors';

export const EDIT_SHORT_URL_START = 'shlink/shortUrlEdition/EDIT_SHORT_URL_START';
export const EDIT_SHORT_URL_ERROR = 'shlink/shortUrlEdition/EDIT_SHORT_URL_ERROR';
export const SHORT_URL_EDITED = 'shlink/shortUrlEdition/SHORT_URL_EDITED';

export interface ShortUrlEdition {
  shortUrl?: ShortUrl;
  saving: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export type ShortUrlEditedAction = PayloadAction<ShortUrl>;

const initialState: ShortUrlEdition = {
  saving: false,
  error: false,
};

export default buildReducer<ShortUrlEdition, ShortUrlEditedAction & ApiErrorAction>({
  [EDIT_SHORT_URL_START]: (state) => ({ ...state, saving: true, error: false }),
  [EDIT_SHORT_URL_ERROR]: (state, { errorData }) => ({ ...state, saving: false, error: true, errorData }),
  [SHORT_URL_EDITED]: (_, { payload: shortUrl }) => ({ shortUrl, saving: false, error: false }),
}, initialState);

export const editShortUrl = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  shortCode: string,
  domain: OptionalString,
  data: EditShortUrlData,
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: EDIT_SHORT_URL_START });

  const { updateShortUrl } = buildShlinkApiClient(getState);

  try {
    const payload = await updateShortUrl(shortCode, domain, data as any); // FIXME parse dates;

    dispatch<ShortUrlEditedAction>({ payload, type: SHORT_URL_EDITED });
  } catch (e: any) {
    dispatch<ApiErrorAction>({ type: EDIT_SHORT_URL_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};
