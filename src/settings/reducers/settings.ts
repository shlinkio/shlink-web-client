import { Action } from 'redux';
import { mergeDeepRight } from 'ramda';
import { buildReducer } from '../../utils/helpers/redux';
import { RecursivePartial } from '../../utils/utils';

export const SET_REAL_TIME_UPDATES = 'shlink/realTimeUpdates/SET_REAL_TIME_UPDATES';

interface RealTimeUpdates {
  enabled: boolean;
  interval?: number;
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

type PartialSettingsAction = Action & RecursivePartial<Settings>;

export default buildReducer<Settings, SettingsAction>({
  [SET_REAL_TIME_UPDATES]: (state, { realTimeUpdates }) => mergeDeepRight(state, { realTimeUpdates }),
}, initialState);

export const toggleRealTimeUpdates = (enabled: boolean): PartialSettingsAction => ({
  type: SET_REAL_TIME_UPDATES,
  realTimeUpdates: { enabled },
});

export const setRealTimeUpdatesInterval = (interval: number): PartialSettingsAction => ({
  type: SET_REAL_TIME_UPDATES,
  realTimeUpdates: { interval },
});
