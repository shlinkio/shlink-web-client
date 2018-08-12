import ShlinkApiClient from '../../api/ShlinkApiClient';
import { curry } from 'ramda';

const GET_SHORT_URL_VISITS_START = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_START';
const GET_SHORT_URL_VISITS_ERROR = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS_ERROR';
const GET_SHORT_URL_VISITS = 'shlink/shortUrlVisits/GET_SHORT_URL_VISITS';

const initialState = {
  shortUrl: {},
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
        shortUrl: action.shortUrl,
        visits: action.visits,
        loading: false,
        error: false
      };
    default:
      return state;
  }
}

export const _getShortUrlVisits = (ShlinkApiClient, shortCode, dates) => dispatch => {
  dispatch({ type: GET_SHORT_URL_VISITS_START });

  Promise.all([
    ShlinkApiClient.getShortUrlVisits(shortCode, dates),
    ShlinkApiClient.getShortUrl(shortCode)
  ])
    .then(([visits, shortUrl]) => dispatch({ visits, shortUrl, type: GET_SHORT_URL_VISITS }))
    .catch(() => dispatch({ type: GET_SHORT_URL_VISITS_ERROR }));
};
export const getShortUrlVisits = curry(_getShortUrlVisits)(ShlinkApiClient);
