import { combineReducers } from '@reduxjs/toolkit';
import { appUpdatesReducer } from '../app/reducers/appUpdates';
import { selectedServerReducer } from '../servers/reducers/selectedServer';
import { serversReducer } from '../servers/reducers/servers';
import { settingsReducer } from '../settings/reducers/settings';

export const initReducers = () =>
  combineReducers({
    appUpdated: appUpdatesReducer,
    servers: serversReducer,
    selectedServer: selectedServerReducer,
    settings: settingsReducer,
  });
