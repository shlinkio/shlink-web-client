import { createAction, createSlice } from '@reduxjs/toolkit';
import { memoizeWith } from '@shlinkio/data-manipulation';
import type { ShlinkHealth } from '@shlinkio/shlink-web-component/api-contract';
import type { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { createAsyncThunk } from '../../utils/helpers/redux';
import { versionToPrintable, versionToSemVer as toSemVer } from '../../utils/helpers/version';
import type { SelectedServer, ServerWithId } from '../data';

const REDUCER_PREFIX = 'shlink/selectedServer';

export const MIN_FALLBACK_VERSION = '1.0.0';
export const MAX_FALLBACK_VERSION = '999.999.999';
export const LATEST_VERSION_CONSTRAINT = 'latest';

const versionToSemVer = (version: string) => toSemVer(
  version === LATEST_VERSION_CONSTRAINT ? MAX_FALLBACK_VERSION : version,
  MIN_FALLBACK_VERSION,
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
      const apiClient = buildShlinkApiClient(selectedServer);
      const { version, printableVersion } = await getServerVersion(selectedServer, () => apiClient.health());

      return {
        ...selectedServer,
        version,
        printableVersion,
      };
    } catch {
      return { ...selectedServer, serverNotReachable: true };
    }
  },
);

type SelectServerThunk = ReturnType<typeof selectServer>;

export const selectedServerReducerCreator = (selectServerThunk: SelectServerThunk) => createSlice({
  name: REDUCER_PREFIX,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetSelectedServer, () => initialState);
    builder.addCase(selectServerThunk.fulfilled, (_, { payload }) => payload as any);
  },
});
