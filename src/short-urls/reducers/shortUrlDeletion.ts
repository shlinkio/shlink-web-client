import { PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { GetState } from '../../container/types';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { parseApiError } from '../../api/utils';
import { ApiErrorAction } from '../../api/types/actions';
import { ProblemDetailsError } from '../../api/types/errors';

export const DELETE_SHORT_URL_START = 'shlink/deleteShortUrl/DELETE_SHORT_URL_START';
export const DELETE_SHORT_URL_ERROR = 'shlink/deleteShortUrl/DELETE_SHORT_URL_ERROR';
export const SHORT_URL_DELETED = 'shlink/deleteShortUrl/SHORT_URL_DELETED';
export const RESET_DELETE_SHORT_URL = 'shlink/deleteShortUrl/RESET_DELETE_SHORT_URL';

export interface ShortUrlDeletion {
  shortCode: string;
  loading: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export interface DeleteShortUrl {
  shortCode: string;
  domain?: string | null;
}

export type DeleteShortUrlAction = PayloadAction<DeleteShortUrl>;

const initialState: ShortUrlDeletion = {
  shortCode: '',
  loading: false,
  error: false,
};

export default buildReducer<ShortUrlDeletion, DeleteShortUrlAction & ApiErrorAction>({
  [DELETE_SHORT_URL_START]: (state) => ({ ...state, loading: true, error: false }),
  [DELETE_SHORT_URL_ERROR]: (state, { errorData }) => ({ ...state, errorData, loading: false, error: true }),
  [SHORT_URL_DELETED]: (state, { payload }) => (
    { ...state, shortCode: payload.shortCode, loading: false, error: false }
  ),
  [RESET_DELETE_SHORT_URL]: () => initialState,
}, initialState);

export const deleteShortUrl = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  { shortCode, domain }: DeleteShortUrl,
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: DELETE_SHORT_URL_START });
  const { deleteShortUrl: shlinkDeleteShortUrl } = buildShlinkApiClient(getState);

  try {
    await shlinkDeleteShortUrl(shortCode, domain);
    dispatch<DeleteShortUrlAction>({
      type: SHORT_URL_DELETED,
      payload: { shortCode, domain },
    });
  } catch (e: any) {
    dispatch<ApiErrorAction>({ type: DELETE_SHORT_URL_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};

export const resetDeleteShortUrl = buildActionCreator(RESET_DELETE_SHORT_URL);
