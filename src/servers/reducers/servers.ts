import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { assoc, dissoc, fromPairs, map, pipe, reduce, toPairs } from 'ramda';
import { v4 as uuid } from 'uuid';
import type { ServerData, ServersMap, ServerWithId } from '../data';

interface EditServer {
  serverId: string;
  serverData: Partial<ServerData>;
}

interface SetAutoConnect {
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

const serversListToMap = reduce<ServerWithId, ServersMap>((acc, server) => assoc(server.id, server, acc), {});

export const { actions, reducer } = createSlice({
  name: 'shlink/servers',
  initialState,
  reducers: {
    editServer: {
      prepare: (serverId: string, serverData: Partial<ServerData>) => ({
        payload: { serverId, serverData },
      }),
      reducer: (state, { payload }: PayloadAction<EditServer>) => {
        const { serverId, serverData } = payload;
        return (
          !state[serverId] ? state : assoc(serverId, { ...state[serverId], ...serverData }, state)
        );
      },
    },
    deleteServer: (state, { payload }) => dissoc(payload.id, state),
    setAutoConnect: {
      prepare: ({ id: serverId }: ServerWithId, autoConnect: boolean) => ({
        payload: { serverId, autoConnect },
      }),
      reducer: (state, { payload }: PayloadAction<SetAutoConnect>) => {
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
    },
    createServers: {
      prepare: pipe(
        map(serverWithId),
        serversListToMap,
        (payload: ServersMap) => ({ payload }),
      ),
      reducer: (state, { payload: newServers }: PayloadAction<ServersMap>) => ({ ...state, ...newServers }),
    },
  },
});

export const { editServer, deleteServer, setAutoConnect, createServers } = actions;

export const serversReducer = reducer;
