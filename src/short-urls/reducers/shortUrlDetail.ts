import { Action, Dispatch } from 'redux';
import { ShortUrl } from '../data';
import { buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { OptionalString } from '../../utils/utils';
import { GetState } from '../../container/types';

/* eslint-disable padding-line-between-statements */
export const GET_SHORT_URL_DETAIL_START = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL_START';
export const GET_SHORT_URL_DETAIL_ERROR = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL_ERROR';
export const GET_SHORT_URL_DETAIL = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL';
/* eslint-enable padding-line-between-statements */

export interface ShortUrlDetail {
  shortUrl?: ShortUrl;
  loading: boolean;
  error: boolean;
}

export interface ShortUrlDetailAction extends Action<string> {
  shortUrl: ShortUrl;
}

const initialState: ShortUrlDetail = {
  loading: false,
  error: false,
};

export default buildReducer<ShortUrlDetail, ShortUrlDetailAction>({
  [GET_SHORT_URL_DETAIL_START]: () => ({ loading: true, error: false }),
  [GET_SHORT_URL_DETAIL_ERROR]: () => ({ loading: false, error: true }),
  [GET_SHORT_URL_DETAIL]: (_, { shortUrl }) => ({ shortUrl, ...initialState }),
}, initialState);

export const getShortUrlDetail = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  shortCode: string,
  domain: OptionalString,
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: GET_SHORT_URL_DETAIL_START });
  const { getShortUrl } = buildShlinkApiClient(getState);

  try {
    const shortUrl = await getShortUrl(shortCode, domain);

    dispatch<ShortUrlDetailAction>({ shortUrl, type: GET_SHORT_URL_DETAIL });
  } catch (e) {
    dispatch({ type: GET_SHORT_URL_DETAIL_ERROR });
  }
};
