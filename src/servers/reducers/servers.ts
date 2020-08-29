import { assoc, dissoc, map, pipe, reduce } from 'ramda';
import { v4 as uuid } from 'uuid';
import { Action } from 'redux';
import { ServerData, ServersMap, ServerWithId } from '../data';
import { buildReducer } from '../../utils/helpers/redux';

/* eslint-disable padding-line-between-statements */
export const EDIT_SERVER = 'shlink/servers/EDIT_SERVER';
export const DELETE_SERVER = 'shlink/servers/DELETE_SERVER';
export const CREATE_SERVERS = 'shlink/servers/CREATE_SERVERS';
/* eslint-enable padding-line-between-statements */

export interface CreateServersAction extends Action<string> {
  newServers: ServersMap;
}

const initialState: ServersMap = {};

const serverWithId = (server: ServerWithId | ServerData): ServerWithId => {
  if ((server as ServerWithId).id) {
    return server as ServerWithId;
  }

  return assoc('id', uuid(), server);
};

export default buildReducer<ServersMap, CreateServersAction>({
  [CREATE_SERVERS]: (state, { newServers }) => ({ ...state, ...newServers }),
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

export const editServer = (serverId: string, serverData: Partial<ServerData>) => ({
  type: EDIT_SERVER,
  serverId,
  serverData,
});

export const deleteServer = ({ id }: ServerWithId) => ({ type: DELETE_SERVER, serverId: id });
