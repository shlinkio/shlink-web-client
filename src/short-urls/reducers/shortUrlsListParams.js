import { LIST_SHORT_URLS } from './shortUrlsList';

export default function reducer(state = { page: 1 }, action) {
  switch (action.type) {
    case LIST_SHORT_URLS:
      return { ...state, ...action.params };
    default:
      return state;
  }
}
