import { createAction, createListenerMiddleware, PayloadAction } from '@reduxjs/toolkit';
import { identity, memoizeWith, pipe } from 'ramda';
import { versionToPrintable, versionToSemVer as toSemVer } from '../../utils/helpers/version';
import { isReachableServer, SelectedServer } from '../data';
import { ShlinkHealth } from '../../api/types';
import { buildReducer, createAsyncThunk } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';

export const SELECT_SERVER = 'shlink/selectedServer/selectServer';
export const RESET_SELECTED_SERVER = 'shlink/selectedServer/resetSelectedServer';

export const MIN_FALLBACK_VERSION = '1.0.0';
export const MAX_FALLBACK_VERSION = '999.999.999';
export const LATEST_VERSION_CONSTRAINT = 'latest';

export type SelectServerAction = PayloadAction<SelectedServer>;

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

export default buildReducer<SelectedServer, SelectServerAction>({
  [RESET_SELECTED_SERVER]: () => initialState,
  [SELECT_SERVER]: (_, { payload }) => payload,
  [`${SELECT_SERVER}/fulfilled`]: (_, { payload }) => payload,
}, initialState);

export const resetSelectedServer = createAction<void>(RESET_SELECTED_SERVER);

export const selectServer = (
  buildShlinkApiClient: ShlinkApiClientBuilder,
) => createAsyncThunk(SELECT_SERVER, async (serverId: string, { dispatch, getState }): Promise<SelectedServer> => {
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
});

export const selectServerListener = (
  selectServerThunk: ReturnType<typeof selectServer>,
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
