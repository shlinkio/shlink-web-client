import { Action, Dispatch } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import { OptionalString } from '../../utils/utils';
import { ShortUrlIdentifier } from '../data';
import { ShlinkApiClientBuilder } from '../../utils/services/ShlinkApiClientBuilder';
import { ProblemDetailsError } from '../../api/types';
import { parseApiError } from '../../api/utils';

/* eslint-disable padding-line-between-statements */
export const EDIT_SHORT_URL_START = 'shlink/shortUrlEdition/EDIT_SHORT_URL_START';
export const EDIT_SHORT_URL_ERROR = 'shlink/shortUrlEdition/EDIT_SHORT_URL_ERROR';
export const SHORT_URL_EDITED = 'shlink/shortUrlEdition/SHORT_URL_EDITED';
/* eslint-enable padding-line-between-statements */

export interface ShortUrlEdition {
  shortCode: string | null;
  longUrl: string | null;
  saving: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export interface ShortUrlEditedAction extends Action<string>, ShortUrlIdentifier {
  longUrl: string;
}

export interface ShortUrlEditionFailedAction extends Action<string> {
  errorData?: ProblemDetailsError;
}

const initialState: ShortUrlEdition = {
  shortCode: null,
  longUrl: null,
  saving: false,
  error: false,
};

export default buildReducer<ShortUrlEdition, ShortUrlEditedAction & ShortUrlEditionFailedAction>({
  [EDIT_SHORT_URL_START]: (state) => ({ ...state, saving: true, error: false }),
  [EDIT_SHORT_URL_ERROR]: (state, { errorData }) => ({ ...state, saving: false, error: true, errorData }),
  [SHORT_URL_EDITED]: (_, { shortCode, longUrl }) => ({ shortCode, longUrl, saving: false, error: false }),
}, initialState);

export const editShortUrl = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  shortCode: string,
  domain: OptionalString,
  longUrl: string,
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: EDIT_SHORT_URL_START });
  const { updateShortUrlMeta } = buildShlinkApiClient(getState);

  try {
    await updateShortUrlMeta(shortCode, domain, { longUrl });
    dispatch<ShortUrlEditedAction>({ shortCode, longUrl, domain, type: SHORT_URL_EDITED });
  } catch (e) {
    dispatch<ShortUrlEditionFailedAction>({ type: EDIT_SHORT_URL_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};
