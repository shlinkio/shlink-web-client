import { combineReducers } from '@reduxjs/toolkit';
import type { IContainer } from 'bottlejs';
import { appUpdatesReducer } from '../app/reducers/appUpdates';
import { sidebarReducer } from '../common/reducers/sidebar';
import type { ShlinkState } from '../container/types';
import { serversReducer } from '../servers/reducers/servers';
import { settingsReducer } from '../settings/reducers/settings';

export const initReducers = (container: IContainer) => combineReducers<ShlinkState>({
  appUpdated: appUpdatesReducer,
  servers: serversReducer,
  selectedServer: container.selectedServerReducer,
  settings: settingsReducer,
  sidebar: sidebarReducer,
});
