import { UPDATE_SHORT_URLS_LIST, LIST_SHORT_URLS } from './shortUrlsList';

export default function reducer(state = { page: 1 }, action) {
  switch (action.type) {
    case UPDATE_SHORT_URLS_LIST:
    case LIST_SHORT_URLS:
      return { ...state, ...action.params };
    default:
      return state;
  }
}
