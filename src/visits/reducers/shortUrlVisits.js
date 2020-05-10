import { createAction, handleActions } from 'redux-actions';
import PropTypes from 'prop-types';
import { flatten, prop, range, splitEvery } from 'ramda';
import { shortUrlMatches } from '../../short-urls/helpers';
import { VisitType } from '../types';

/* eslint-disable padding-line-between-statements */
export const GET_SHORT_URL_VISITS_START = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_START';
export const GET_SHORT_URL_VISITS_ERROR = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_ERROR';
export const GET_SHORT_URL_VISITS = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS';
export const GET_SHORT_URL_VISITS_LARGE = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_LARGE';
export const GET_SHORT_URL_VISITS_CANCEL = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_CANCEL';
export const CREATE_SHORT_URL_VISIT = 'shlink/shortUrlVisits/CREATE_SHORT_URL_VISIT';
/* eslint-enable padding-line-between-statements */

export const shortUrlVisitsType = PropTypes.shape({ // TODO Should extend from VisitInfoType
  visits: PropTypes.arrayOf(VisitType),
  shortCode: PropTypes.string,
  domain: PropTypes.string,
  loading: PropTypes.bool,
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
  [GET_SHORT_URL_VISITS_START]: (state) => ({
    ...state,
    loading: true,
    loadingLarge: false,
    cancelLoad: false,
  }),
  [GET_SHORT_URL_VISITS_ERROR]: (state) => ({
    ...state,
    loading: false,
    loadingLarge: false,
    error: true,
    cancelLoad: false,
  }),
  [GET_SHORT_URL_VISITS]: (state, { visits, shortCode, domain }) => ({
    visits,
    shortCode,
    domain,
    loading: false,
    loadingLarge: false,
    error: false,
    cancelLoad: false,
  }),
  [GET_SHORT_URL_VISITS_LARGE]: (state) => ({ ...state, loadingLarge: true }),
  [GET_SHORT_URL_VISITS_CANCEL]: (state) => ({ ...state, cancelLoad: true }),
  [CREATE_SHORT_URL_VISIT]: (state, { shortUrl, visit }) => { // eslint-disable-line object-shorthand
    const { shortCode, domain, visits } = state;

    if (!shortUrlMatches(shortUrl, shortCode, domain)) {
      return state;
    }

    return { ...state, visits: [ ...visits, visit ] };
  },
}, initialState);

export const getShortUrlVisits = (buildShlinkApiClient) => (shortCode, query = {}) => async (dispatch, getState) => {
  dispatch({ type: GET_SHORT_URL_VISITS_START });
  const { getShortUrlVisits } = buildShlinkApiClient(getState);
  const itemsPerPage = 5000;
  const isLastPage = ({ currentPage, pagesCount }) => currentPage >= pagesCount;

  const loadVisits = async (page = 1) => {
    const { pagination, data } = await getShortUrlVisits(shortCode, { ...query, page, itemsPerPage });

    // If pagination was not returned, then this is an older shlink version. Just return data
    if (!pagination || isLastPage(pagination)) {
      return data;
    }

    // If there are more pages, make requests in blocks of 4
    const parallelRequestsCount = 4;
    const parallelStartingPage = 2;
    const pagesRange = range(parallelStartingPage, pagination.pagesCount + 1);
    const pagesBlocks = splitEvery(parallelRequestsCount, pagesRange);

    if (pagination.pagesCount - 1 > parallelRequestsCount) {
      dispatch({ type: GET_SHORT_URL_VISITS_LARGE });
    }

    return data.concat(await loadPagesBlocks(pagesBlocks));
  };

  const loadPagesBlocks = async (pagesBlocks, index = 0) => {
    const { shortUrlVisits: { cancelLoad } } = getState();

    if (cancelLoad) {
      return [];
    }

    const data = await loadVisitsInParallel(pagesBlocks[index]);

    if (index < pagesBlocks.length - 1) {
      return data.concat(await loadPagesBlocks(pagesBlocks, index + 1));
    }

    return data;
  };

  const loadVisitsInParallel = (pages) =>
    Promise.all(pages.map(
      (page) =>
        getShortUrlVisits(shortCode, { ...query, page, itemsPerPage })
          .then(prop('data'))
    )).then(flatten);

  try {
    const visits = await loadVisits();

    dispatch({ visits, shortCode, domain: query.domain, type: GET_SHORT_URL_VISITS });
  } catch (e) {
    dispatch({ type: GET_SHORT_URL_VISITS_ERROR });
  }
};

export const cancelGetShortUrlVisits = createAction(GET_SHORT_URL_VISITS_CANCEL);

export const createNewVisit = ({ shortUrl, visit }) => ({ shortUrl, visit, type: CREATE_SHORT_URL_VISIT });
