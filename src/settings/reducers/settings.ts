import { Action } from 'redux';
import { buildReducer } from '../../utils/helpers/redux';

export const SET_REAL_TIME_UPDATES = 'shlink/realTimeUpdates/SET_REAL_TIME_UPDATES';

interface RealTimeUpdates {
  enabled: boolean;
}

export interface Settings {
  realTimeUpdates: RealTimeUpdates;
}

const initialState: Settings = {
  realTimeUpdates: {
    enabled: true,
  },
};

type SettingsAction = Action & Settings;

export default buildReducer<Settings, SettingsAction>({
  [SET_REAL_TIME_UPDATES]: (state, { realTimeUpdates }) => ({ ...state, realTimeUpdates }),
}, initialState);

export const setRealTimeUpdates = (enabled: boolean): SettingsAction => ({
  type: SET_REAL_TIME_UPDATES,
  realTimeUpdates: { enabled },
});
