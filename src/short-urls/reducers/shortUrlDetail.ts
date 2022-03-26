import { Action, Dispatch } from 'redux';
import { ShortUrl } from '../data';
import { buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { OptionalString } from '../../utils/utils';
import { GetState } from '../../container/types';
import { shortUrlMatches } from '../helpers';
import { ProblemDetailsError } from '../../api/types';
import { parseApiError } from '../../api/utils';
import { ApiErrorAction } from '../../api/types/actions';

export const GET_SHORT_URL_DETAIL_START = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL_START';
export const GET_SHORT_URL_DETAIL_ERROR = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL_ERROR';
export const GET_SHORT_URL_DETAIL = 'shlink/shortUrlDetail/GET_SHORT_URL_DETAIL';

export interface ShortUrlDetail {
  shortUrl?: ShortUrl;
  loading: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
}

export interface ShortUrlDetailAction extends Action<string> {
  shortUrl: ShortUrl;
}

const initialState: ShortUrlDetail = {
  loading: false,
  error: false,
};

export default buildReducer<ShortUrlDetail, ShortUrlDetailAction & ApiErrorAction>({
  [GET_SHORT_URL_DETAIL_START]: () => ({ loading: true, error: false }),
  [GET_SHORT_URL_DETAIL_ERROR]: (_, { errorData }) => ({ loading: false, error: true, errorData }),
  [GET_SHORT_URL_DETAIL]: (_, { shortUrl }) => ({ shortUrl, ...initialState }),
}, initialState);

export const getShortUrlDetail = (buildShlinkApiClient: ShlinkApiClientBuilder) => (
  shortCode: string,
  domain: OptionalString,
) => async (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: GET_SHORT_URL_DETAIL_START });

  try {
    const { shortUrlsList } = getState();
    const shortUrl = shortUrlsList?.shortUrls?.data.find(
      (url) => shortUrlMatches(url, shortCode, domain),
    ) ?? await buildShlinkApiClient(getState).getShortUrl(shortCode, domain);

    dispatch<ShortUrlDetailAction>({ shortUrl, type: GET_SHORT_URL_DETAIL });
  } catch (e: any) {
    dispatch<ApiErrorAction>({ type: GET_SHORT_URL_DETAIL_ERROR, errorData: parseApiError(e) });
  }
};
