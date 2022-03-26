import { assoc, dissoc, fromPairs, map, pipe, reduce, toPairs } from 'ramda';
import { v4 as uuid } from 'uuid';
import { Action } from 'redux';
import { ServerData, ServersMap, ServerWithId } from '../data';
import { buildReducer } from '../../utils/helpers/redux';

export const EDIT_SERVER = 'shlink/servers/EDIT_SERVER';
export const DELETE_SERVER = 'shlink/servers/DELETE_SERVER';
export const CREATE_SERVERS = 'shlink/servers/CREATE_SERVERS';
export const SET_AUTO_CONNECT = 'shlink/servers/SET_AUTO_CONNECT';

export interface CreateServersAction extends Action<string> {
  newServers: ServersMap;
}

interface DeleteServerAction extends Action<string> {
  serverId: string;
}

interface SetAutoConnectAction extends Action<string> {
  serverId: string;
  autoConnect: boolean;
}

const initialState: ServersMap = {};

const serverWithId = (server: ServerWithId | ServerData): ServerWithId => {
  if ((server as ServerWithId).id) {
    return server as ServerWithId;
  }

  return assoc('id', uuid(), server);
};

export default buildReducer<ServersMap, CreateServersAction & DeleteServerAction & SetAutoConnectAction>({
  [CREATE_SERVERS]: (state, { newServers }) => ({ ...state, ...newServers }),
  [DELETE_SERVER]: (state, { serverId }) => dissoc(serverId, state),
  [EDIT_SERVER]: (state, { serverId, serverData }: any) => (
    !state[serverId] ? state : assoc(serverId, { ...state[serverId], ...serverData }, state)
  ),
  [SET_AUTO_CONNECT]: (state, { serverId, autoConnect }) => {
    if (!state[serverId]) {
      return state;
    }

    if (!autoConnect) {
      return assoc(serverId, { ...state[serverId], autoConnect }, state);
    }

    return fromPairs(
      toPairs(state).map(([evaluatedServerId, server]) => [
        evaluatedServerId,
        { ...server, autoConnect: evaluatedServerId === serverId },
      ]),
    );
  },
}, initialState);

const serversListToMap = reduce<ServerWithId, ServersMap>((acc, server) => assoc(server.id, server, acc), {});

export const createServers = pipe(
  map(serverWithId),
  serversListToMap,
  (newServers: ServersMap) => ({ type: CREATE_SERVERS, newServers }),
);

export const createServer = (server: ServerWithId) => createServers([server]);

export const editServer = (serverId: string, serverData: Partial<ServerData>) => ({
  type: EDIT_SERVER,
  serverId,
  serverData,
});

export const deleteServer = ({ id }: ServerWithId): DeleteServerAction => ({ type: DELETE_SERVER, serverId: id });

export const setAutoConnect = ({ id }: ServerWithId, autoConnect: boolean): SetAutoConnectAction => ({
  type: SET_AUTO_CONNECT,
  serverId: id,
  autoConnect,
});
