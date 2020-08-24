import { handleActions } from 'redux-actions';
import { Action } from 'redux';

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

export default handleActions<Settings, any>({
  [SET_REAL_TIME_UPDATES]: (state, { realTimeUpdates }: any) => ({ ...state, realTimeUpdates }),
}, initialState);

export const setRealTimeUpdates = (enabled: boolean): Action & Settings => ({
  type: SET_REAL_TIME_UPDATES,
  realTimeUpdates: { enabled },
});
