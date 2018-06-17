import { UPDATE_SHORT_URLS_LIST } from '../../reducers/types';

export default function shortUrlsListReducer(state = { page: 1 }, action) {
  switch (action.type) {
    case UPDATE_SHORT_URLS_LIST:
      return { ...state, ...action.params };
    default:
      return state;
  }
}
