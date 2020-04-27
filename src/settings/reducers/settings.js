import { handleActions } from 'redux-actions';
import PropTypes from 'prop-types';

export const SET_REAL_TIME_UPDATES = 'shlink/realTimeUpdates/SET_REAL_TIME_UPDATES';

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
  [SET_REAL_TIME_UPDATES]: (state, { realTimeUpdates }) => ({ ...state, realTimeUpdates }),
}, initialState);

export const setRealTimeUpdates = (enabled) => ({
  type: SET_REAL_TIME_UPDATES,
  realTimeUpdates: { enabled },
});
