import { handleActions } from 'redux-actions';
import { pipe, isEmpty, assoc, map } from 'ramda';
import { v4 as uuid } from 'uuid';
import { homepage } from '../../../package.json';

/* eslint-disable padding-line-between-statements */
export const FETCH_SERVERS_START = 'shlink/servers/FETCH_SERVERS_START';
export const FETCH_SERVERS = 'shlink/servers/FETCH_SERVERS';
/* eslint-enable padding-line-between-statements */

const initialState = {
  list: {},
  loading: false,
};

const assocId = (server) => assoc('id', uuid(), server);

export default handleActions({
  [FETCH_SERVERS_START]: (state) => ({ ...state, loading: true }),
  [FETCH_SERVERS]: (state, { list }) => ({ list, loading: false }),
}, initialState);

export const listServers = ({ listServers, createServers }, { get }) => () => async (dispatch) => {
  dispatch({ type: FETCH_SERVERS_START });

  // Fetch list from local storage.
  const localList = listServers();

  if (!isEmpty(localList)) {
    dispatch({ type: FETCH_SERVERS, list: localList });

    return;
  }

  // If local list is empty, try to fetch it remotely, calculate IDs for every server, and use it
  const { data: remoteList } = await get(`${homepage}/servers.json`);
  const listWithIds = map(assocId, remoteList);

  createServers(listWithIds);
  dispatch({ type: FETCH_SERVERS, list: listWithIds });
};

export const createServer = ({ createServer }, listServersAction) => pipe(createServer, listServersAction);

export const deleteServer = ({ deleteServer }, listServersAction) => pipe(deleteServer, listServersAction);

export const createServers = ({ createServers }, listServersAction) => pipe(
  map(assocId),
  createServers,
  listServersAction
);
