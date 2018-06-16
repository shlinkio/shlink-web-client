import { LIST_SHORT_URLS } from '../../reducers/types';

export default function selectedServerReducer(state = null, action) {
  switch (action.type) {
    case LIST_SHORT_URLS:
      return action.selectedServer;
    default:
      return state;
  }
}
