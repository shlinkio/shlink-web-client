import { identity, memoizeWith, pipe } from 'ramda';
import { Action, Dispatch } from 'redux';
import { resetShortUrlParams } from '../../short-urls/reducers/shortUrlsListParams';
import { versionToPrintable, versionToSemVer as toSemVer } from '../../utils/helpers/version';
import { SelectedServer } from '../data';
import { GetState } from '../../container/types';
import { ShlinkHealth } from '../../utils/services/types';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';
import { ShlinkApiClientBuilder } from '../../utils/services/ShlinkApiClientBuilder';

/* eslint-disable padding-line-between-statements */
export const SELECT_SERVER = 'shlink/selectedServer/SELECT_SERVER';
export const RESET_SELECTED_SERVER = 'shlink/selectedServer/RESET_SELECTED_SERVER';

export const MIN_FALLBACK_VERSION = '1.0.0';
export const MAX_FALLBACK_VERSION = '999.999.999';
export const LATEST_VERSION_CONSTRAINT = 'latest';
/* eslint-enable padding-line-between-statements */

export interface SelectServerAction extends Action<string> {
  selectedServer: SelectedServer;
}

const versionToSemVer = pipe(
  (version: string) => version === LATEST_VERSION_CONSTRAINT ? MAX_FALLBACK_VERSION : version,
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
  [SELECT_SERVER]: (_, { selectedServer }) => selectedServer,
}, initialState);

export const resetSelectedServer = buildActionCreator(RESET_SELECTED_SERVER);

export const selectServer = (
  buildShlinkApiClient: ShlinkApiClientBuilder,
  loadMercureInfo: () => Action,
) => (
  serverId: string,
) => async (
  dispatch: Dispatch,
  getState: GetState,
) => {
  dispatch(resetSelectedServer());
  dispatch(resetShortUrlParams());

  const { servers } = getState();
  const selectedServer = servers[serverId];

  if (!selectedServer) {
    dispatch<SelectServerAction>({
      type: SELECT_SERVER,
      selectedServer: { serverNotFound: true },
    });

    return;
  }

  try {
    const { health } = buildShlinkApiClient(selectedServer);
    const { version, printableVersion } = await getServerVersion(serverId, health);

    dispatch<SelectServerAction>({
      type: SELECT_SERVER,
      selectedServer: {
        ...selectedServer,
        version,
        printableVersion,
      },
    });
    dispatch(loadMercureInfo());
  } catch (e) {
    dispatch<SelectServerAction>({
      type: SELECT_SERVER,
      selectedServer: { ...selectedServer, serverNotReachable: true },
    });
  }
};
