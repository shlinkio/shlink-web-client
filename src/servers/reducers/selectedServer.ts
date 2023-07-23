import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createListenerMiddleware, createSlice } from '@reduxjs/toolkit';
import { memoizeWith, pipe } from 'ramda';
import type { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import type { ShlinkHealth } from '../../api/types';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { versionToPrintable, versionToSemVer as toSemVer } from '../../utils/helpers/version';
import type { SelectedServer, ServerWithId } from '../data';
import { isReachableServer } from '../data';

const REDUCER_PREFIX = 'shlink/selectedServer';

export const MIN_FALLBACK_VERSION = '1.0.0';
export const MAX_FALLBACK_VERSION = '999.999.999';
export const LATEST_VERSION_CONSTRAINT = 'latest';

const versionToSemVer = pipe(
  (version: string) => (version === LATEST_VERSION_CONSTRAINT ? MAX_FALLBACK_VERSION : version),
  toSemVer(MIN_FALLBACK_VERSION),
);

const getServerVersion = memoizeWith(
  (server: ServerWithId) => `${server.id}_${server.url}_${server.apiKey}`,
  async (_server: ServerWithId, health: () => Promise<ShlinkHealth>) => health().then(({ version }) => ({
    version: versionToSemVer(version),
    printableVersion: versionToPrintable(version),
  })),
);

const initialState: SelectedServer = null;

export const resetSelectedServer = createAction<void>(`${REDUCER_PREFIX}/resetSelectedServer`);

export const selectServer = (buildShlinkApiClient: ShlinkApiClientBuilder) => createAsyncThunk(
  `${REDUCER_PREFIX}/selectServer`,
  async (serverId: string, { dispatch, getState }): Promise<SelectedServer> => {
    dispatch(resetSelectedServer());

    const { servers } = getState();
    const selectedServer = servers[serverId];

    if (!selectedServer) {
      return { serverNotFound: true };
    }

    try {
      const { health } = buildShlinkApiClient(selectedServer);
      const { version, printableVersion } = await getServerVersion(selectedServer, health);

      return {
        ...selectedServer,
        version,
        printableVersion,
      };
    } catch (e) {
      return { ...selectedServer, serverNotReachable: true };
    }
  },
);

type SelectServerThunk = ReturnType<typeof selectServer>;

export const selectServerListener = (
  selectServerThunk: SelectServerThunk,
  loadMercureInfo: () => PayloadAction<any>, // TODO Consider setting actual type, if relevant
) => {
  const listener = createListenerMiddleware();

  // TODO Find a way for the mercure info to be re-loaded when server changes, without leaking mercure implementation
  //      details
  // listener.startListening({
  //   actionCreator: selectServerThunk.fulfilled,
  //   effect: ({ payload }, { dispatch }) => {
  //     isReachableServer(payload) && dispatch(loadMercureInfo());
  //   },
  // });

  return listener;
};

export const selectedServerReducerCreator = (selectServerThunk: SelectServerThunk) => createSlice({
  name: REDUCER_PREFIX,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetSelectedServer, () => initialState);
    builder.addCase(selectServerThunk.fulfilled, (_, { payload }) => payload as any);
  },
});
