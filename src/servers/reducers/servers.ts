import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { ServerData, ServersMap, ServerWithId } from '../data';
import { serversListToMap, serverWithId } from '../helpers';

interface EditServer {
  serverId: string;
  serverData: Partial<ServerData>;
}

interface SetAutoConnect {
  serverId: string;
  autoConnect: boolean;
}

const initialState: ServersMap = {};

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
          !state[serverId] ? state : { ...state, [serverId]: { ...state[serverId], ...serverData } }
        );
      },
    },
    deleteServer: (state, { payload }) => {
      delete state[payload.id];
      return state;
    },
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
          return { ...state, [serverId]: { ...state[serverId], autoConnect } };
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
      prepare: (servers: ServerData[]) => {
        const payload = serversListToMap(servers.map(serverWithId));
        return { payload };
      },
      reducer: (state, { payload: newServers }: PayloadAction<ServersMap>) => ({ ...state, ...newServers }),
    },
  },
});

export const { editServer, deleteServer, setAutoConnect, createServers } = actions;

export const serversReducer = reducer;
