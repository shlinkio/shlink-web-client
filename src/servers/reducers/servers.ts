import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { createPipe, map, omit, reduce } from 'remeda';
import { v4 as uuid } from 'uuid';
import { assoc } from '../../utils/utils';
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

  return assoc(server, 'id', uuid());
};

const serversListToMap = reduce<ServerWithId, ServersMap>((acc, server) => assoc(acc, server.id, server), {});

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
          !state[serverId] ? state : assoc(state, serverId, { ...state[serverId], ...serverData })
        );
      },
    },
    deleteServer: (state, { payload }) => omit(state, [payload.id]),
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
          return assoc(state, serverId, { ...state[serverId], autoConnect });
        }

        return Object.fromEntries(
          Object.entries(state).map(([evaluatedServerId, server]) => [
            evaluatedServerId,
            { ...server, autoConnect: evaluatedServerId === serverId },
          ]),
        );
      },
    },
    createServers: {
      prepare: createPipe(
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
