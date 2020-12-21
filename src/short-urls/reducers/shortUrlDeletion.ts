import { Action, Dispatch } from 'redux';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { ProblemDetailsError } from '../../utils/services/types';
import { GetState } from '../../container/types';
import { ShlinkApiClientBuilder } from '../../utils/services/ShlinkApiClientBuilder';
import { parseApiError } from '../../api/util';

/* eslint-disable padding-line-between-statements */
export const DELETE_SHORT_URL_START = 'shlink/deleteShortUrl/DELETE_SHORT_URL_START';
export const DELETE_SHORT_URL_ERROR = 'shlink/deleteShortUrl/DELETE_SHORT_URL_ERROR';
export const SHORT_URL_DELETED = 'shlink/deleteShortUrl/SHORT_URL_DELETED';
export const RESET_DELETE_SHORT_URL = 'shlink/deleteShortUrl/RESET_DELETE_SHORT_URL';
/* eslint-enable padding-line-between-statements */

export interface ShortUrlDeletion {
  shortCode: string;
  loading: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export interface DeleteShortUrlAction extends Action<string> {
  shortCode: string;
  domain?: string | null;
}

interface DeleteShortUrlErrorAction extends Action<string> {
  errorData?: ProblemDetailsError;
}

const initialState: ShortUrlDeletion = {
  shortCode: '',
  loading: false,
  error: false,
};

export default buildReducer<ShortUrlDeletion, DeleteShortUrlAction & DeleteShortUrlErrorAction>({
  [DELETE_SHORT_URL_START]: (state) => ({ ...state, loading: true, error: false }),
  [DELETE_SHORT_URL_ERROR]: (state, { errorData }) => ({ ...state, errorData, loading: false, error: true }),
  [SHORT_URL_DELETED]: (state, { shortCode }) => ({ ...state, shortCode, loading: false, error: false }),
  [RESET_DELETE_SHORT_URL]: () => initialState,
}, initialState);

export const deleteShortUrl = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  shortCode: string,
  domain?: string | null,
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: DELETE_SHORT_URL_START });
  const { deleteShortUrl } = buildShlinkApiClient(getState);

  try {
    await deleteShortUrl(shortCode, domain);
    dispatch<DeleteShortUrlAction>({ type: SHORT_URL_DELETED, shortCode, domain });
  } catch (e) {
    dispatch<DeleteShortUrlErrorAction>({ type: DELETE_SHORT_URL_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};

export const resetDeleteShortUrl = buildActionCreator(RESET_DELETE_SHORT_URL);
