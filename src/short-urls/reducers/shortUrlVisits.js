import ShlinkApiClient from '../../api/ShlinkApiClient';

const GET_SHORT_URL_VISITS_START = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_START';
const GET_SHORT_URL_VISITS_ERROR = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_ERROR';
const GET_SHORT_URL_VISITS = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS';

const initialState = {
  visits: [],
  loading: false,
  error: false
};

export default function dispatch (state = initialState, action) {
  switch (action.type) {
    case GET_SHORT_URL_VISITS_START:
      return {
        ...state,
        loading: true
      };
    case GET_SHORT_URL_VISITS_ERROR:
      return {
        ...state,
        loading: false,
        error: true
      };
    case GET_SHORT_URL_VISITS:
      return {
        visits: action.visits,
        loading: false,
        error: false
      };
    default:
      return state;
  }
}

export const getShortUrlVisits = shortCode => async dispatch => {
  dispatch({ type: GET_SHORT_URL_VISITS_START });

  try {
    const visits = await ShlinkApiClient.getShortUrlVisits(shortCode);
    dispatch({ visits, type: GET_SHORT_URL_VISITS });
  } catch (e) {
    dispatch({ type: GET_SHORT_URL_VISITS_ERROR });
  }
};
