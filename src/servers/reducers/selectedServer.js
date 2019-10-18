import { createAction, handleActions } from 'redux-actions';
import { resetShortUrlParams } from '../../short-urls/reducers/shortUrlsListParams';
import { versionIsValidSemVer } from '../../utils/utils';

/* eslint-disable padding-line-between-statements */
export const SELECT_SERVER = 'shlink/selectedServer/SELECT_SERVER';
export const RESET_SELECTED_SERVER = 'shlink/selectedServer/RESET_SELECTED_SERVER';

export const MIN_FALLBACK_VERSION = '1.0.0';
export const MAX_FALLBACK_VERSION = '999.999.999';
export const LATEST_VERSION_CONSTRAINT = 'latest';
/* eslint-enable padding-line-between-statements */

const initialState = null;

export const resetSelectedServer = createAction(RESET_SELECTED_SERVER);

export const selectServer = ({ findServerById }, buildShlinkApiClient) => (serverId) => async (dispatch) => {
  dispatch(resetShortUrlParams());

  const selectedServer = findServerById(serverId);
  const { health } = await buildShlinkApiClient(selectedServer);
  const version = await health()
    .then(({ version }) => version === LATEST_VERSION_CONSTRAINT ? MAX_FALLBACK_VERSION : version)
    .then((version) => !versionIsValidSemVer(version) ? MIN_FALLBACK_VERSION : version)
    .catch(() => MIN_FALLBACK_VERSION);

  dispatch({
    type: SELECT_SERVER,
    selectedServer: {
      ...selectedServer,
      version,
    },
  });
};

export default handleActions({
  [RESET_SELECTED_SERVER]: () => initialState,
  [SELECT_SERVER]: (state, { selectedServer }) => selectedServer,
}, initialState);
