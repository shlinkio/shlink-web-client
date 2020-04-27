import { handleActions } from 'redux-actions';
import { pipe, isEmpty, assoc, map, prop, reduce, dissoc } from 'ramda';
import { v4 as uuid } from 'uuid';
import { homepage } from '../../../package.json';

/* eslint-disable padding-line-between-statements */
export const LIST_SERVERS = 'shlink/servers/LIST_SERVERS';
export const EDIT_SERVER = 'shlink/servers/EDIT_SERVER';
export const DELETE_SERVER = 'shlink/servers/DELETE_SERVER';
export const CREATE_SERVERS = 'shlink/servers/CREATE_SERVERS';
/* eslint-enable padding-line-between-statements */

const initialState = {};

const assocId = (server) => assoc('id', server.id || uuid(), server);

export default handleActions({
  [LIST_SERVERS]: (state, { list }) => list,
  [CREATE_SERVERS]: (state, { newServers }) => ({ ...state, ...newServers }),
  [DELETE_SERVER]: (state, { serverId }) => dissoc(serverId, state),
  [EDIT_SERVER]: (state, { serverId, serverData }) => !state[serverId]
    ? state
    : assoc(serverId, { ...state[serverId], ...serverData }, state),
}, initialState);

export const listServers = ({ listServers, createServers }, { get }) => () => async (dispatch) => {
  const localList = listServers();

  if (!isEmpty(localList)) {
    dispatch({ type: LIST_SERVERS, list: localList });

    return;
  }

  // If local list is empty, try to fetch it remotely (making sure it's an array) and calculate IDs for every server
  const getDataAsArrayWithIds = pipe(
    prop('data'),
    (value) => {
      if (!Array.isArray(value)) {
        throw new Error('Value is not an array');
      }

      return value;
    },
    map(assocId),
  );
  const remoteList = await get(`${homepage}/servers.json`)
    .then(getDataAsArrayWithIds)
    .catch(() => []);

  createServers(remoteList);
  dispatch({ type: LIST_SERVERS, list: remoteList.reduce((map, server) => ({ ...map, [server.id]: server }), {}) });
};

export const createServer = (server) => createServers([ server ]);

const serversListToMap = reduce((acc, server) => assoc(server.id, server, acc), {});

export const createServers = pipe(
  map(assocId),
  serversListToMap,
  (newServers) => ({ type: CREATE_SERVERS, newServers })
);

export const editServer = (serverId, serverData) => ({ type: EDIT_SERVER, serverId, serverData });

export const deleteServer = ({ id }) => ({ type: DELETE_SERVER, serverId: id });
