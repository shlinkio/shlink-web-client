import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { OrderDir } from '../../utils/utils';
import { LIST_SHORT_URLS, ListShortUrlsAction } from './shortUrlsList';

export const RESET_SHORT_URL_PARAMS = 'shlink/shortUrlsListParams/RESET_SHORT_URL_PARAMS';

export interface ShortUrlsListParams {
  page?: string;
  tags?: string[];
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: Record<string, OrderDir>;
}

const initialState: ShortUrlsListParams = { page: '1' };

export default buildReducer<ShortUrlsListParams, ListShortUrlsAction>({
  [LIST_SHORT_URLS]: (state, { params }) => ({ ...state, ...params }),
  [RESET_SHORT_URL_PARAMS]: () => initialState,
}, initialState);

export const resetShortUrlParams = buildActionCreator(RESET_SHORT_URL_PARAMS);
