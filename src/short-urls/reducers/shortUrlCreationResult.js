import ShlinkApiClient from '../../api/ShlinkApiClient';

const CREATE_SHORT_URL_START = 'shlink/createShortUrl/CREATE_SHORT_URL_START';
const CREATE_SHORT_URL_ERROR = 'shlink/createShortUrl/CREATE_SHORT_URL_ERROR';
const CREATE_SHORT_URL = 'shlink/createShortUrl/CREATE_SHORT_URL';

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
        error: true,
      };
    default:
      return state;
  }
}

export const createShortUrl = data => async dispatch => {
  dispatch({ type: CREATE_SHORT_URL_START });

  try {
    const result = await ShlinkApiClient.createShortUrl(data);
    dispatch({ type: CREATE_SHORT_URL, result });
  } catch (e) {
    dispatch({ type: CREATE_SHORT_URL_ERROR });
  }
};
