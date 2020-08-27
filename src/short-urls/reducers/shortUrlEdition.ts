import { Action, Dispatch } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../utils/services/types';
import { GetState } from '../../container/types';
import { OptionalString } from '../../utils/utils';
import { ShortUrlIdentifier } from '../data';

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
}

export interface ShortUrlEditedAction extends Action<string>, ShortUrlIdentifier {
  longUrl: string;
}

const initialState: ShortUrlEdition = {
  shortCode: null,
  longUrl: null,
  saving: false,
  error: false,
};

export default buildReducer<ShortUrlEdition, ShortUrlEditedAction>({
  [EDIT_SHORT_URL_START]: (state) => ({ ...state, saving: true, error: false }),
  [EDIT_SHORT_URL_ERROR]: (state) => ({ ...state, saving: false, error: true }),
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
    dispatch({ type: EDIT_SHORT_URL_ERROR });

    throw e;
  }
};
