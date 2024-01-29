import { combineReducers } from '@reduxjs/toolkit';
import type { IContainer } from 'bottlejs';
import { appUpdatesReducer } from '../app/reducers/appUpdates';
import { serversReducer } from '../servers/reducers/servers';
import { settingsReducer } from '../settings/reducers/settings';

export const initReducers = (container: IContainer) => combineReducers({
  appUpdated: appUpdatesReducer,
  servers: serversReducer,
  selectedServer: container.selectedServerReducer,
  settings: settingsReducer,
});
