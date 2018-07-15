import { LIST_SHORT_URLS } from '../../short-urls/reducers/shortUrlsList';

export default function reducer(state = null, action) {
  switch (action.type) {
    case LIST_SHORT_URLS:
      return action.selectedServer;
    default:
      return state;
  }
}
