import { handleActions } from 'redux-actions';
import PropTypes from 'prop-types';

/* eslint-disable padding-line-between-statements */
export const GET_MERCURE_INFO_START = 'shlink/mercure/GET_MERCURE_INFO_START';
export const GET_MERCURE_INFO_ERROR = 'shlink/mercure/GET_MERCURE_INFO_ERROR';
export const GET_MERCURE_INFO = 'shlink/mercure/GET_MERCURE_INFO';
/* eslint-enable padding-line-between-statements */

export const MercureInfoType = PropTypes.shape({
  token: PropTypes.string,
  mercureHubUrl: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.bool,
});

const initialState = {
  token: undefined,
  mercureHubUrl: undefined,
  loading: true,
  error: false,
};

export default handleActions({
  [GET_MERCURE_INFO_START]: (state) => ({ ...state, loading: true, error: false }),
  [GET_MERCURE_INFO_ERROR]: (state) => ({ ...state, loading: false, error: true }),
  [GET_MERCURE_INFO]: (state, { token, mercureHubUrl }) => ({ token, mercureHubUrl, loading: false, error: false }),
}, initialState);

export const loadMercureInfo = (buildShlinkApiClient) => () => async (dispatch, getState) => {
  dispatch({ type: GET_MERCURE_INFO_START });

  const { settings } = getState();
  const { mercureInfo } = buildShlinkApiClient(getState);

  if (!settings.realTimeUpdates.enabled) {
    dispatch({ type: GET_MERCURE_INFO_ERROR });

    return;
  }

  try {
    const result = await mercureInfo();

    dispatch({ type: GET_MERCURE_INFO, ...result });
  } catch (e) {
    dispatch({ type: GET_MERCURE_INFO_ERROR });
  }
};
