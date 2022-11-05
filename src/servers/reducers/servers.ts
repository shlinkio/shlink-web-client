import { PayloadAction } from '@reduxjs/toolkit';
import { assoc, dissoc, fromPairs, map, pipe, reduce, toPairs } from 'ramda';
import { v4 as uuid } from 'uuid';
import { ServerData, ServersMap, ServerWithId } from '../data';
import { buildReducer } from '../../utils/helpers/redux';

export const EDIT_SERVER = 'shlink/servers/EDIT_SERVER';
export const DELETE_SERVER = 'shlink/servers/DELETE_SERVER';
export const CREATE_SERVERS = 'shlink/servers/CREATE_SERVERS';
export const SET_AUTO_CONNECT = 'shlink/servers/SET_AUTO_CONNECT';

export type CreateServersAction = PayloadAction<ServersMap>;

type DeleteServerAction = PayloadAction<{
  serverId: string;
}>;

type SetAutoConnectAction = PayloadAction<{
  serverId: string;
  autoConnect: boolean;
}>;

const initialState: ServersMap = {};

const serverWithId = (server: ServerWithId | ServerData): ServerWithId => {
  if ((server as ServerWithId).id) {
    return server as ServerWithId;
  }

  return assoc('id', uuid(), server);
};

export default buildReducer<ServersMap, CreateServersAction & DeleteServerAction & SetAutoConnectAction>({
  [CREATE_SERVERS]: (state, { payload: newServers }) => ({ ...state, ...newServers }),
  [DELETE_SERVER]: (state, { payload }) => dissoc(payload.serverId, state),
  [EDIT_SERVER]: (state, { payload }: any) => {
    const { serverId, serverData } = payload;
    return (
      !state[serverId] ? state : assoc(serverId, { ...state[serverId], ...serverData }, state)
    );
  },
  [SET_AUTO_CONNECT]: (state, { payload }) => {
    const { serverId, autoConnect } = payload;
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
  (newServers: ServersMap) => ({ type: CREATE_SERVERS, payload: newServers }),
);

export const createServer = (server: ServerWithId) => createServers([server]);

export const editServer = (serverId: string, serverData: Partial<ServerData>) => ({
  type: EDIT_SERVER,
  payload: { serverId, serverData },
});

export const deleteServer = ({ id }: ServerWithId): DeleteServerAction => ({
  type: DELETE_SERVER,
  payload: { serverId: id },
});

export const setAutoConnect = ({ id }: ServerWithId, autoConnect: boolean): SetAutoConnectAction => ({
  type: SET_AUTO_CONNECT,
  payload: { serverId: id, autoConnect },
});
