import { handleActions } from 'redux-actions';
import PropTypes from 'prop-types';

export const LOAD_REAL_TIME_UPDATES = 'shlink/realTimeUpdates/LOAD_REAL_TIME_UPDATES';

export const SettingsType = PropTypes.shape({
  realTimeUpdates: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
  }),
});

const initialState = {
  realTimeUpdates: {
    enabled: true,
  },
};

export default handleActions({
  [LOAD_REAL_TIME_UPDATES]: (state, { realTimeUpdates }) => ({ ...state, realTimeUpdates }),
}, initialState);

export const setRealTimeUpdates = ({ updateSettings }, loadRealTimeUpdatesAction) => (enabled) => {
  updateSettings({ realTimeUpdates: { enabled } });

  return loadRealTimeUpdatesAction();
};

export const loadRealTimeUpdates = ({ loadSettings }) => () => {
  const { realTimeUpdates = {} } = loadSettings();

  return {
    type: LOAD_REAL_TIME_UPDATES,
    realTimeUpdates,
  };
};
