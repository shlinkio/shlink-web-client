import { curry } from 'ramda';
import PropTypes from 'prop-types';
import shlinkApiClient from '../../api/ShlinkApiClient';

const CREATE_SHORT_URL_START = 'shlink/createShortUrl/CREATE_SHORT_URL_START';
const CREATE_SHORT_URL_ERROR = 'shlink/createShortUrl/CREATE_SHORT_URL_ERROR';
const CREATE_SHORT_URL = 'shlink/createShortUrl/CREATE_SHORT_URL';
const RESET_CREATE_SHORT_URL = 'shlink/createShortUrl/RESET_CREATE_SHORT_URL';

export const createShortUrlResultType = {
  result: PropTypes.shape({
    shortUrl: PropTypes.string,
  }),
  saving: PropTypes.bool,
  error: PropTypes.bool,
};

const defaultState = {
  result: null,
  saving: false,
  error: false,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_SHORT_URL_START:
      return {
        ...state,
        saving: true,
      };
    case CREATE_SHORT_URL_ERROR:
      return {
        ...state,
        saving: false,
        error: true,
      };
    case CREATE_SHORT_URL:
      return {
        result: action.result,
        saving: false,
        error: false,
      };
    case RESET_CREATE_SHORT_URL:
      return defaultState;
    default:
      return state;
  }
}

export const _createShortUrl = (shlinkApiClient, data) => async (dispatch) => {
  dispatch({ type: CREATE_SHORT_URL_START });

  try {
    const result = await shlinkApiClient.createShortUrl(data);

    dispatch({ type: CREATE_SHORT_URL, result });
  } catch (e) {
    dispatch({ type: CREATE_SHORT_URL_ERROR });
  }
};

export const createShortUrl = curry(_createShortUrl)(shlinkApiClient);

export const resetCreateShortUrl = () => ({ type: RESET_CREATE_SHORT_URL });
