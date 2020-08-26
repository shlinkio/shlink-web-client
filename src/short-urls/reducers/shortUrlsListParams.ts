import PropTypes from 'prop-types';
import { Action } from 'redux';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { LIST_SHORT_URLS } from './shortUrlsList';

export const RESET_SHORT_URL_PARAMS = 'shlink/shortUrlsListParams/RESET_SHORT_URL_PARAMS';

/** @deprecated Use ShortUrlsListParams interface instead */
export const shortUrlsListParamsType = PropTypes.shape({
  page: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  searchTerm: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  orderBy: PropTypes.object,
});

export interface ShortUrlsListParams {
  page: string;
  tags?: string[];
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: object;
}

interface ListShortUrlsAction extends Action<string> {
  params: ShortUrlsListParams;
}

const initialState = { page: '1' };

export default buildReducer<ShortUrlsListParams, ListShortUrlsAction>({
  [LIST_SHORT_URLS]: (state, { params }) => ({ ...state, ...params }),
  [RESET_SHORT_URL_PARAMS]: () => initialState,
}, initialState);

export const resetShortUrlParams = buildActionCreator(RESET_SHORT_URL_PARAMS);
