import { createAction, handleActions } from 'redux-actions';
import PropTypes from 'prop-types';
import { shortUrlMatches } from '../../short-urls/helpers';
import { VisitType } from '../types';
import { getVisitsWithLoader } from './common';
import { CREATE_VISIT } from './visitCreation';

/* eslint-disable padding-line-between-statements */
export const GET_SHORT_URL_VISITS_START = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_START';
export const GET_SHORT_URL_VISITS_ERROR = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_ERROR';
export const GET_SHORT_URL_VISITS = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS';
export const GET_SHORT_URL_VISITS_LARGE = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_LARGE';
export const GET_SHORT_URL_VISITS_CANCEL = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_CANCEL';
/* eslint-enable padding-line-between-statements */

export const shortUrlVisitsType = PropTypes.shape({ // TODO Should extend from VisitInfoType
  visits: PropTypes.arrayOf(VisitType),
  shortCode: PropTypes.string,
  domain: PropTypes.string,
  loading: PropTypes.bool,
  loadingLarge: PropTypes.bool,
  error: PropTypes.bool,
});

const initialState = {
  visits: [],
  shortCode: '',
  domain: undefined,
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
};

export default handleActions({
  [GET_SHORT_URL_VISITS_START]: () => ({ ...initialState, loading: true }),
  [GET_SHORT_URL_VISITS_ERROR]: () => ({ ...initialState, error: true }),
  [GET_SHORT_URL_VISITS]: (state, { visits, shortCode, domain }) => ({
    ...initialState,
    visits,
    shortCode,
    domain,
  }),
  [GET_SHORT_URL_VISITS_LARGE]: (state) => ({ ...state, loadingLarge: true }),
  [GET_SHORT_URL_VISITS_CANCEL]: (state) => ({ ...state, cancelLoad: true }),
  [CREATE_VISIT]: (state, { shortUrl, visit }) => { // eslint-disable-line object-shorthand
    const { shortCode, domain, visits } = state;

    if (!shortUrlMatches(shortUrl, shortCode, domain)) {
      return state;
    }

    return { ...state, visits: [ ...visits, visit ] };
  },
}, initialState);

export const getShortUrlVisits = (buildShlinkApiClient) => (shortCode, query = {}) => (dispatch, getState) => {
  const { getShortUrlVisits } = buildShlinkApiClient(getState);
  const visitsLoader = (page, itemsPerPage) => getShortUrlVisits(shortCode, { ...query, page, itemsPerPage });
  const extraFinishActionData = { shortCode, domain: query.domain };
  const actionMap = {
    start: GET_SHORT_URL_VISITS_START,
    large: GET_SHORT_URL_VISITS_LARGE,
    finish: GET_SHORT_URL_VISITS,
    error: GET_SHORT_URL_VISITS_ERROR,
  };

  return getVisitsWithLoader(visitsLoader, extraFinishActionData, actionMap, dispatch, getState);
};

export const cancelGetShortUrlVisits = createAction(GET_SHORT_URL_VISITS_CANCEL);
