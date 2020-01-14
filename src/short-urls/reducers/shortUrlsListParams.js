import { createAction, handleActions } from 'redux-actions';
import PropTypes from 'prop-types';
import { LIST_SHORT_URLS } from './shortUrlsList';

export const RESET_SHORT_URL_PARAMS = 'shlink/shortUrlsListParams/RESET_SHORT_URL_PARAMS';

export const shortUrlsListParamsType = PropTypes.shape({
  page: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  searchTerm: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  orderBy: PropTypes.object,
});

const initialState = { page: '1' };

export default handleActions({
  [LIST_SHORT_URLS]: (state, { params }) => ({ ...state, ...params }),
  [RESET_SHORT_URL_PARAMS]: () => initialState,
}, initialState);

export const resetShortUrlParams = createAction(RESET_SHORT_URL_PARAMS);
