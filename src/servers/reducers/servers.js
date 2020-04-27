import { handleActions } from 'redux-actions';
import { pipe, assoc, map, reduce, dissoc } from 'ramda';
import { v4 as uuid } from 'uuid';

/* eslint-disable padding-line-between-statements */
export const EDIT_SERVER = 'shlink/servers/EDIT_SERVER';
export const DELETE_SERVER = 'shlink/servers/DELETE_SERVER';
export const CREATE_SERVERS = 'shlink/servers/CREATE_SERVERS';
/* eslint-enable padding-line-between-statements */

const initialState = {};

const assocId = (server) => assoc('id', server.id || uuid(), server);

export default handleActions({
  [CREATE_SERVERS]: (state, { newServers }) => ({ ...state, ...newServers }),
  [DELETE_SERVER]: (state, { serverId }) => dissoc(serverId, state),
  [EDIT_SERVER]: (state, { serverId, serverData }) => !state[serverId]
    ? state
    : assoc(serverId, { ...state[serverId], ...serverData }, state),
}, initialState);

export const createServer = (server) => createServers([ server ]);

const serversListToMap = reduce((acc, server) => assoc(server.id, server, acc), {});

export const createServers = pipe(
  map(assocId),
  serversListToMap,
  (newServers) => ({ type: CREATE_SERVERS, newServers })
);

export const editServer = (serverId, serverData) => ({ type: EDIT_SERVER, serverId, serverData });

export const deleteServer = ({ id }) => ({ type: DELETE_SERVER, serverId: id });
