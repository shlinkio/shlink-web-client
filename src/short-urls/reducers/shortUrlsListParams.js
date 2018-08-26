import PropTypes from 'prop-types';
import { LIST_SHORT_URLS } from './shortUrlsList';

export const RESET_SHORT_URL_PARAMS = 'shlink/shortUrlsListParams/RESET_SHORT_URL_PARAMS';

export const shortUrlsListParamsType = PropTypes.shape({
  page: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  searchTerm: PropTypes.string,
});

const defaultState = { page: '1' };

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case LIST_SHORT_URLS:
      return { ...state, ...action.params };
    case RESET_SHORT_URL_PARAMS:
      return defaultState;
    default:
      return state;
  }
}

export const resetShortUrlParams = () => ({ type: RESET_SHORT_URL_PARAMS });
