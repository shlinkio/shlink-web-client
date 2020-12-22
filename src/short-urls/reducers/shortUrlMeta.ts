import { Dispatch, Action } from 'redux';
import { ShortUrlIdentifier, ShortUrlMeta } from '../data';
import { GetState } from '../../container/types';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { OptionalString } from '../../utils/utils';
import { ShlinkApiClientBuilder } from '../../utils/services/ShlinkApiClientBuilder';
import { ProblemDetailsError } from '../../utils/services/types';
import { parseApiError } from '../../api/utils';

/* eslint-disable padding-line-between-statements */
export const EDIT_SHORT_URL_META_START = 'shlink/shortUrlMeta/EDIT_SHORT_URL_META_START';
export const EDIT_SHORT_URL_META_ERROR = 'shlink/shortUrlMeta/EDIT_SHORT_URL_META_ERROR';
export const SHORT_URL_META_EDITED = 'shlink/shortUrlMeta/SHORT_URL_META_EDITED';
export const RESET_EDIT_SHORT_URL_META = 'shlink/shortUrlMeta/RESET_EDIT_SHORT_URL_META';
/* eslint-enable padding-line-between-statements */

export interface ShortUrlMetaEdition {
  shortCode: string | null;
  meta: ShortUrlMeta;
  saving: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export interface ShortUrlMetaEditedAction extends Action<string>, ShortUrlIdentifier {
  meta: ShortUrlMeta;
}

export interface ShortUrlMetaEditionFailedAction extends Action<string> {
  errorData?: ProblemDetailsError;
}

const initialState: ShortUrlMetaEdition = {
  shortCode: null,
  meta: {},
  saving: false,
  error: false,
};

export default buildReducer<ShortUrlMetaEdition, ShortUrlMetaEditedAction & ShortUrlMetaEditionFailedAction>({
  [EDIT_SHORT_URL_META_START]: (state) => ({ ...state, saving: true, error: false }),
  [EDIT_SHORT_URL_META_ERROR]: (state, { errorData }) => ({ ...state, saving: false, error: true, errorData }),
  [SHORT_URL_META_EDITED]: (_, { shortCode, meta }) => ({ shortCode, meta, saving: false, error: false }),
  [RESET_EDIT_SHORT_URL_META]: () => initialState,
}, initialState);

export const editShortUrlMeta = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  shortCode: string,
  domain: OptionalString,
  meta: ShortUrlMeta,
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: EDIT_SHORT_URL_META_START });
  const { updateShortUrlMeta } = buildShlinkApiClient(getState);

  try {
    await updateShortUrlMeta(shortCode, domain, meta);
    dispatch<ShortUrlMetaEditedAction>({ shortCode, meta, domain, type: SHORT_URL_META_EDITED });
  } catch (e) {
    dispatch<ShortUrlMetaEditionFailedAction>({ type: EDIT_SHORT_URL_META_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};

export const resetShortUrlMeta = buildActionCreator(RESET_EDIT_SHORT_URL_META);
