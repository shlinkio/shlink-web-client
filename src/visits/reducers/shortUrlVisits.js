import PropTypes from 'prop-types';

/* eslint-disable padding-line-between-statements, newline-after-var */
export const GET_SHORT_URL_VISITS_START = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_START';
export const GET_SHORT_URL_VISITS_ERROR = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_ERROR';
export const GET_SHORT_URL_VISITS = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS';
/* eslint-enable padding-line-between-statements, newline-after-var */

export const shortUrlVisitsType = PropTypes.shape({
  visits: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.bool,
});

const initialState = {
  visits: [],
  loading: false,
  error: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_SHORT_URL_VISITS_START:
      return {
        ...state,
        loading: true,
      };
    case GET_SHORT_URL_VISITS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    case GET_SHORT_URL_VISITS:
      return {
        visits: action.visits,
        loading: false,
        error: false,
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

    return data.concat(await loadVisits(page + 1));
  };

  try {
    const visits = await loadVisits();

    dispatch({ visits, type: GET_SHORT_URL_VISITS });
  } catch (e) {
    dispatch({ type: GET_SHORT_URL_VISITS_ERROR });
  }
};
