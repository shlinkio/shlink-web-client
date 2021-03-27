import { Action, Dispatch } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import { OptionalString } from '../../utils/utils';
import { EditShortUrlData, ShortUrlIdentifier } from '../data';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
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
  data: EditShortUrlData,
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: EDIT_SHORT_URL_START });

  // TODO Pass tags to the updateTags function if server version is lower than 2.6
  const { updateShortUrl } = buildShlinkApiClient(getState);

  try {
    const { longUrl } = await updateShortUrl(shortCode, domain, data as any); // FIXME Parse dates

    dispatch<ShortUrlEditedAction>({ shortCode, longUrl, domain, type: SHORT_URL_EDITED });
  } catch (e) {
    dispatch<ShortUrlEditionFailedAction>({ type: EDIT_SHORT_URL_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};
