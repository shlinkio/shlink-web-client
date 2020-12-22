import { Action, Dispatch } from 'redux';
import { GetState } from '../../container/types';
import { ShortUrl, ShortUrlData } from '../data';
import { buildReducer, buildActionCreator } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../utils/services/ShlinkApiClientBuilder';
import { ProblemDetailsError } from '../../api/types';
import { parseApiError } from '../../api/utils';

/* eslint-disable padding-line-between-statements */
export const CREATE_SHORT_URL_START = 'shlink/createShortUrl/CREATE_SHORT_URL_START';
export const CREATE_SHORT_URL_ERROR = 'shlink/createShortUrl/CREATE_SHORT_URL_ERROR';
export const CREATE_SHORT_URL = 'shlink/createShortUrl/CREATE_SHORT_URL';
export const RESET_CREATE_SHORT_URL = 'shlink/createShortUrl/RESET_CREATE_SHORT_URL';
/* eslint-enable padding-line-between-statements */

export interface ShortUrlCreation {
  result: ShortUrl | null;
  saving: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export interface CreateShortUrlAction extends Action<string> {
  result: ShortUrl;
}

export interface CreateShortUrlFailedAction extends Action<string> {
  errorData?: ProblemDetailsError;
}

const initialState: ShortUrlCreation = {
  result: null,
  saving: false,
  error: false,
};

export default buildReducer<ShortUrlCreation, CreateShortUrlAction & CreateShortUrlFailedAction>({
  [CREATE_SHORT_URL_START]: (state) => ({ ...state, saving: true, error: false }),
  [CREATE_SHORT_URL_ERROR]: (state, { errorData }) => ({ ...state, saving: false, error: true, errorData }),
  [CREATE_SHORT_URL]: (_, { result }) => ({ result, saving: false, error: false }),
  [RESET_CREATE_SHORT_URL]: () => initialState,
}, initialState);

export const createShortUrl = (buildShlinkApiClient: ShlinkApiClientBuilder) => (data: ShortUrlData) => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch({ type: CREATE_SHORT_URL_START });
  const { createShortUrl } = buildShlinkApiClient(getState);

  try {
    const result = await createShortUrl(data);

    dispatch<CreateShortUrlAction>({ type: CREATE_SHORT_URL, result });
  } catch (e) {
    dispatch<CreateShortUrlFailedAction>({ type: CREATE_SHORT_URL_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};

export const resetCreateShortUrl = buildActionCreator(RESET_CREATE_SHORT_URL);
