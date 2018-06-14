const FETCH_SERVERS = 'shlink/FETCH_SERVERS';
const CREATE_SERVER = 'shlink/FETCH_SERVERS';

export default function serversReducer(state = [{ name: 'bar' }], action) {
  switch (action.type) {
    case FETCH_SERVERS:
      return action.servers;
    case CREATE_SERVER:
      return [ ...state, action.server ];
  }

  return state;
}


