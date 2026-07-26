import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import type { ServerData, ServersMap, ServerWithId } from '../data';
import { serversListToMap } from '../helpers';

type EditServer = {
  serverId: string;
  serverData: Partial<ServerData>;
};

type SetAutoConnect = {
  serverId: string;
  autoConnect: boolean;
};

const initialState: ServersMap = {};

export const { actions, reducer: serversReducer } = createSlice({
  name: 'shlink/servers',
  initialState,
  reducers: {
    editServer: {
      prepare: (serverId: string, serverData: Partial<ServerData>) => ({
        payload: { serverId, serverData },
      }),
      reducer: (state, { payload }: PayloadAction<EditServer>) => {
        const { serverId, serverData } = payload;
        return !state[serverId] ? state : { ...state, [serverId]: { ...state[serverId], ...serverData } };
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
      prepare: (servers: ServerWithId[]) => ({ payload: serversListToMap(servers) }),
      reducer: (state, { payload: newServers }: PayloadAction<ServersMap>) => ({ ...state, ...newServers }),
    },
  },
});

export const { editServer, deleteServer, setAutoConnect, createServers } = actions;

export const useServers = () => {
  const dispatch = useAppDispatch();
  const servers = useAppSelector((state) => state.servers);
  const editServer = useCallback(
    (serverId: string, serverData: Partial<ServerData>) => dispatch(actions.editServer(serverId, serverData)),
    [dispatch],
  );
  const deleteServer = useCallback((server: ServerWithId) => dispatch(actions.deleteServer(server)), [dispatch]);
  const setAutoConnect = useCallback(
    (serverData: ServerWithId, autoConnect: boolean) => dispatch(actions.setAutoConnect(serverData, autoConnect)),
    [dispatch],
  );
  const createServers = useCallback((servers: ServerWithId[]) => dispatch(actions.createServers(servers)), [dispatch]);

  return { servers, editServer, deleteServer, setAutoConnect, createServers };
};
