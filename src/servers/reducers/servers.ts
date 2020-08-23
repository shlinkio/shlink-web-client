import { handleActions } from 'redux-actions';
import { pipe, assoc, map, reduce, dissoc } from 'ramda';
import { v4 as uuid } from 'uuid';
import { NewServerData, ServerWithId } from '../data';

/* eslint-disable padding-line-between-statements */
export const EDIT_SERVER = 'shlink/servers/EDIT_SERVER';
export const DELETE_SERVER = 'shlink/servers/DELETE_SERVER';
export const CREATE_SERVERS = 'shlink/servers/CREATE_SERVERS';
/* eslint-enable padding-line-between-statements */

export type ServersMap = Record<string, ServerWithId>;

const initialState: ServersMap = {};

const serverWithId = (server: ServerWithId | NewServerData): ServerWithId => {
  if ((server as ServerWithId).id) {
    return server as ServerWithId;
  }

  return assoc('id', uuid(), server);
};

export default handleActions<ServersMap, any>({
  [CREATE_SERVERS]: (state, { newServers }: any) => ({ ...state, ...newServers }),
  [DELETE_SERVER]: (state, { serverId }: any) => dissoc(serverId, state),
  [EDIT_SERVER]: (state, { serverId, serverData }: any) => !state[serverId]
    ? state
    : assoc(serverId, { ...state[serverId], ...serverData }, state),
}, initialState);

const serversListToMap = reduce<ServerWithId, ServersMap>((acc, server) => assoc(server.id, server, acc), {});

export const createServers = pipe(
  map(serverWithId),
  serversListToMap,
  (newServers: ServersMap) => ({ type: CREATE_SERVERS, newServers }),
);

export const createServer = (server: ServerWithId) => createServers([ server ]);

export const editServer = (serverId: string, serverData: Partial<NewServerData>) => ({
  type: EDIT_SERVER,
  serverId,
  serverData,
});

export const deleteServer = ({ id }: ServerWithId) => ({ type: DELETE_SERVER, serverId: id });
