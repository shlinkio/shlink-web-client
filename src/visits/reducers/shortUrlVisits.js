import PropTypes from 'prop-types';
import { flatten, prop, range, splitEvery } from 'ramda';

/* eslint-disable padding-line-between-statements, newline-after-var */
export const GET_SHORT_URL_VISITS_START = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_START';
export const GET_SHORT_URL_VISITS_ERROR = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_ERROR';
export const GET_SHORT_URL_VISITS = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS';
export const GET_SHORT_URL_VISITS_LARGE = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_LARGE';
export const GET_SHORT_URL_VISITS_CANCEL = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_CANCEL';
/* eslint-enable padding-line-between-statements, newline-after-var */

export const shortUrlVisitsType = PropTypes.shape({
  visits: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.bool,
});

const initialState = {
  visits: [],
  loading: false,
  loadingLarge: false,
  error: false,
  cancelLoad: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_SHORT_URL_VISITS_START:
      return {
        ...state,
        loading: true,
        loadingLarge: false,
        cancelLoad: false,
      };
    case GET_SHORT_URL_VISITS_ERROR:
      return {
        ...state,
        loading: false,
        loadingLarge: false,
        error: true,
        cancelLoad: false,
      };
    case GET_SHORT_URL_VISITS:
      return {
        visits: action.visits,
        loading: false,
        loadingLarge: false,
        error: false,
        cancelLoad: false,
      };
    case GET_SHORT_URL_VISITS_LARGE:
      return {
        ...state,
        loadingLarge: true,
      };
    case GET_SHORT_URL_VISITS_CANCEL:
      return {
        ...state,
        cancelLoad: true,
      };
    default:
      return state;
  }
}

export const getShortUrlVisits = (buildShlinkApiClient) => (shortCode, dates) => async (dispatch, getState) => {
  dispatch({ type: GET_SHORT_URL_VISITS_START });

  const { selectedServer } = getState();
  const { getShortUrlVisits } = buildShlinkApiClient(selectedServer);
  const itemsPerPage = 5000;
  const isLastPage = ({ currentPage, pagesCount }) => currentPage >= pagesCount;

  const loadVisits = async (page = 1) => {
    const { pagination, data } = await getShortUrlVisits(shortCode, { ...dates, page, itemsPerPage });

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
        getShortUrlVisits(shortCode, { ...dates, page, itemsPerPage })
          .then(prop('data'))
    )).then(flatten);

  try {
    const visits = await loadVisits();

    dispatch({ visits, type: GET_SHORT_URL_VISITS });
  } catch (e) {
    dispatch({ type: GET_SHORT_URL_VISITS_ERROR });
  }
};

export const cancelGetShortUrlVisits = () => ({ type: GET_SHORT_URL_VISITS_CANCEL });
