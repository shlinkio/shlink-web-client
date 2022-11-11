import { createAction, createListenerMiddleware, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { identity, memoizeWith, pipe } from 'ramda';
import { versionToPrintable, versionToSemVer as toSemVer } from '../../utils/helpers/version';
import { isReachableServer, SelectedServer } from '../data';
import { ShlinkHealth } from '../../api/types';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';

const REDUCER_PREFIX = 'shlink/selectedServer';

export const MIN_FALLBACK_VERSION = '1.0.0';
export const MAX_FALLBACK_VERSION = '999.999.999';
export const LATEST_VERSION_CONSTRAINT = 'latest';

const versionToSemVer = pipe(
  (version: string) => (version === LATEST_VERSION_CONSTRAINT ? MAX_FALLBACK_VERSION : version),
  toSemVer(MIN_FALLBACK_VERSION),
);

const getServerVersion = memoizeWith(
  identity,
  async (_serverId: string, health: () => Promise<ShlinkHealth>) => health().then(({ version }) => ({
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
      const { version, printableVersion } = await getServerVersion(serverId, health);

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

  listener.startListening({
    actionCreator: selectServerThunk.fulfilled,
    effect: ({ payload }, { dispatch }) => {
      isReachableServer(payload) && dispatch(loadMercureInfo());
    },
  });

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
