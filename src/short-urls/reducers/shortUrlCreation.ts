import { Action, Dispatch } from 'redux';
import { GetState } from '../../container/types';
import { ShortUrl, ShortUrlData } from '../data';
import { buildReducer, buildActionCreator } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { ProblemDetailsError } from '../../api/types';
import { parseApiError } from '../../api/utils';
import { ApiErrorAction } from '../../api/types/actions';

export const CREATE_SHORT_URL_START = 'shlink/createShortUrl/CREATE_SHORT_URL_START';
export const CREATE_SHORT_URL_ERROR = 'shlink/createShortUrl/CREATE_SHORT_URL_ERROR';
export const CREATE_SHORT_URL = 'shlink/createShortUrl/CREATE_SHORT_URL';
export const RESET_CREATE_SHORT_URL = 'shlink/createShortUrl/RESET_CREATE_SHORT_URL';

export interface ShortUrlCreation {
  result: ShortUrl | null;
  saving: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export interface CreateShortUrlAction extends Action<string> {
  result: ShortUrl;
}

const initialState: ShortUrlCreation = {
  result: null,
  saving: false,
  error: false,
};

export default buildReducer<ShortUrlCreation, CreateShortUrlAction & ApiErrorAction>({
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
  const { createShortUrl: shlinkCreateShortUrl } = buildShlinkApiClient(getState);

  try {
    const result = await shlinkCreateShortUrl(data);

    dispatch<CreateShortUrlAction>({ type: CREATE_SHORT_URL, result });
  } catch (e: any) {
    dispatch<ApiErrorAction>({ type: CREATE_SHORT_URL_ERROR, errorData: parseApiError(e) });

    throw e;
  }
};

export const resetCreateShortUrl = buildActionCreator(RESET_CREATE_SHORT_URL);
