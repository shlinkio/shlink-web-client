import { createAction, handleActions } from 'redux-actions';
import { pipe } from 'ramda';
import { resetShortUrlParams } from '../../short-urls/reducers/shortUrlsListParams';
import { versionToPrintable, versionToSemVer as toSemVer } from '../../utils/versionHelpers';

/* eslint-disable padding-line-between-statements */
export const SELECT_SERVER = 'shlink/selectedServer/SELECT_SERVER';
export const RESET_SELECTED_SERVER = 'shlink/selectedServer/RESET_SELECTED_SERVER';

export const MIN_FALLBACK_VERSION = '1.0.0';
export const MAX_FALLBACK_VERSION = '999.999.999';
export const LATEST_VERSION_CONSTRAINT = 'latest';
/* eslint-enable padding-line-between-statements */

const initialState = null;
const versionToSemVer = pipe(
  (version) => version === LATEST_VERSION_CONSTRAINT ? MAX_FALLBACK_VERSION : version,
  toSemVer(MIN_FALLBACK_VERSION)
);

export const resetSelectedServer = createAction(RESET_SELECTED_SERVER);

export const selectServer = ({ findServerById }, buildShlinkApiClient) => (serverId) => async (dispatch) => {
  dispatch(resetShortUrlParams());

  const selectedServer = findServerById(serverId);
  const { health } = buildShlinkApiClient(selectedServer);
  const { version } = await health().catch(() => MIN_FALLBACK_VERSION);

  dispatch({
    type: SELECT_SERVER,
    selectedServer: {
      ...selectedServer,
      version: versionToSemVer(version),
      printableVersion: versionToPrintable(version),
    },
  });
};

export default handleActions({
  [RESET_SELECTED_SERVER]: () => initialState,
  [SELECT_SERVER]: (state, { selectedServer }) => selectedServer,
}, initialState);
