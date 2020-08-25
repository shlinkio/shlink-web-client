import PropTypes from 'prop-types';
import { Action, Dispatch } from 'redux';
import { ShlinkApiClientBuilder, ShlinkMercureInfo } from '../../utils/services/types';
import { GetState } from '../../container/types';
import { buildReducer } from '../../utils/helpers/redux';

/* eslint-disable padding-line-between-statements */
export const GET_MERCURE_INFO_START = 'shlink/mercure/GET_MERCURE_INFO_START';
export const GET_MERCURE_INFO_ERROR = 'shlink/mercure/GET_MERCURE_INFO_ERROR';
export const GET_MERCURE_INFO = 'shlink/mercure/GET_MERCURE_INFO';
/* eslint-enable padding-line-between-statements */

/** @deprecated Use MercureInfo interface */
export const MercureInfoType = PropTypes.shape({
  token: PropTypes.string,
  mercureHubUrl: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.bool,
});

export interface MercureInfo {
  token?: string;
  mercureHubUrl?: string;
  loading: boolean;
  error: boolean;
}

export type GetMercureInfoAction = Action<string> & ShlinkMercureInfo;

const initialState: MercureInfo = {
  loading: true,
  error: false,
};

export default buildReducer<MercureInfo, GetMercureInfoAction>({
  [GET_MERCURE_INFO_START]: (state) => ({ ...state, loading: true, error: false }),
  [GET_MERCURE_INFO_ERROR]: (state) => ({ ...state, loading: false, error: true }),
  [GET_MERCURE_INFO]: (_, { token, mercureHubUrl }) => ({ token, mercureHubUrl, loading: false, error: false }),
}, initialState);

export const loadMercureInfo = (buildShlinkApiClient: ShlinkApiClientBuilder) =>
  () => async (dispatch: Dispatch, getState: GetState) => {
    dispatch({ type: GET_MERCURE_INFO_START });

    const { settings } = getState();
    const { mercureInfo } = buildShlinkApiClient(getState);

    if (!settings.realTimeUpdates.enabled) {
      dispatch({ type: GET_MERCURE_INFO_ERROR });

      return;
    }

    try {
      const result = await mercureInfo();

      dispatch<Action<ShlinkMercureInfo>>({ type: GET_MERCURE_INFO, ...result });
    } catch (e) {
      dispatch({ type: GET_MERCURE_INFO_ERROR });
    }
  };
