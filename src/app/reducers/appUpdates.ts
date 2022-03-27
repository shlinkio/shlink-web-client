import { Action } from 'redux';
import { buildActionCreator, buildReducer } from '../../utils/helpers/redux';

export const APP_UPDATE_AVAILABLE = 'shlink/appUpdates/APP_UPDATE_AVAILABLE';
export const RESET_APP_UPDATE = 'shlink/appUpdates/RESET_APP_UPDATE';

const initialState = false;

export default buildReducer<boolean, Action<string>>({
  [APP_UPDATE_AVAILABLE]: () => true,
  [RESET_APP_UPDATE]: () => false,
}, initialState);

export const appUpdateAvailable = buildActionCreator(APP_UPDATE_AVAILABLE);

export const resetAppUpdate = buildActionCreator(RESET_APP_UPDATE);
