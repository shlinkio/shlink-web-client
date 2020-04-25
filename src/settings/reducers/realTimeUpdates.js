import { handleActions } from 'redux-actions';
import PropTypes from 'prop-types';

export const LOAD_REAL_TIME_UPDATES = 'shlink/realTimeUpdates/LOAD_REAL_TIME_UPDATES';

export const RealTimeUpdatesType = PropTypes.shape({
  enabled: PropTypes.bool.isRequired,
});

const initialState = {
  enabled: true,
};

export default handleActions({
  [LOAD_REAL_TIME_UPDATES]: (state, { enabled }) => ({ ...state, enabled }),
}, initialState);

export const setRealTimeUpdates = ({ updateSettings }, loadRealTimeUpdatesAction) => (enabled) => {
  updateSettings({ realTimeUpdates: { enabled } });

  return loadRealTimeUpdatesAction();
};

export const loadRealTimeUpdates = ({ loadSettings }) => () => {
  const { realTimeUpdates = {} } = loadSettings();
  const { enabled = true } = realTimeUpdates;

  return {
    type: LOAD_REAL_TIME_UPDATES,
    enabled,
  };
};
