import { LIST_SHORT_URLS } from '../../short-urls/reducers/shortUrlsList';

const RESET_SELECTED_SERVER = 'shlink/selectedServer/RESET_SELECTED_SERVER';

export default function reducer(state = null, action) {
  switch (action.type) {
    case LIST_SHORT_URLS:
      return action.selectedServer;
    case RESET_SELECTED_SERVER:
      return null;
    default:
      return state;
  }
}

export const resetSelectedServer = () => ({ type: RESET_SELECTED_SERVER });
