import PropTypes from 'prop-types';
import { Action, Dispatch } from 'redux';
import { ShlinkApiClientBuilder } from '../../utils/services/types';
import { GetState } from '../../container/types';
import { ShortUrl, ShortUrlData } from '../data';
import { buildReducer, buildActionCreator } from '../../utils/helpers/redux';

/* eslint-disable padding-line-between-statements */
export const CREATE_SHORT_URL_START = 'shlink/createShortUrl/CREATE_SHORT_URL_START';
export const CREATE_SHORT_URL_ERROR = 'shlink/createShortUrl/CREATE_SHORT_URL_ERROR';
export const CREATE_SHORT_URL = 'shlink/createShortUrl/CREATE_SHORT_URL';
export const RESET_CREATE_SHORT_URL = 'shlink/createShortUrl/RESET_CREATE_SHORT_URL';
/* eslint-enable padding-line-between-statements */

/** @deprecated Use ShortUrlCreation interface instead */
export const createShortUrlResultType = PropTypes.shape({
  result: PropTypes.shape({
    shortUrl: PropTypes.string,
  }),
  saving: PropTypes.bool,
  error: PropTypes.bool,
});

export interface ShortUrlCreation {
  result: ShortUrl | null;
  saving: boolean;
  error: boolean;
}

export interface CreateShortUrlAction extends Action<string> {
  result: ShortUrl;
}

const initialState: ShortUrlCreation = {
  result: null,
  saving: false,
  error: false,
};

export default buildReducer<ShortUrlCreation, CreateShortUrlAction>({
  [CREATE_SHORT_URL_START]: (state) => ({ ...state, saving: true, error: false }),
  [CREATE_SHORT_URL_ERROR]: (state) => ({ ...state, saving: false, error: true }),
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
    dispatch({ type: CREATE_SHORT_URL_ERROR });

    throw e;
  }
};

export const resetCreateShortUrl = buildActionCreator(RESET_CREATE_SHORT_URL);
