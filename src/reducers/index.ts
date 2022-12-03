import { IContainer } from 'bottlejs';
import { combineReducers } from '@reduxjs/toolkit';
import { serversReducer } from '../servers/reducers/servers';
import { settingsReducer } from '../settings/reducers/settings';
import { appUpdatesReducer } from '../app/reducers/appUpdates';
import { sidebarReducer } from '../common/reducers/sidebar';
import { ShlinkState } from '../container/types';

export default (container: IContainer) => combineReducers<ShlinkState>({
  servers: serversReducer,
  selectedServer: container.selectedServerReducer,
  shortUrlsList: container.shortUrlsListReducer,
  shortUrlCreation: container.shortUrlCreationReducer,
  shortUrlDeletion: container.shortUrlDeletionReducer,
  shortUrlEdition: container.shortUrlEditionReducer,
  shortUrlDetail: container.shortUrlDetailReducer,
  shortUrlVisits: container.shortUrlVisitsReducer,
  tagVisits: container.tagVisitsReducer,
  domainVisits: container.domainVisitsReducer,
  orphanVisits: container.orphanVisitsReducer,
  nonOrphanVisits: container.nonOrphanVisitsReducer,
  tagsList: container.tagsListReducer,
  tagDelete: container.tagDeleteReducer,
  tagEdit: container.tagEditReducer,
  mercureInfo: container.mercureInfoReducer,
  settings: settingsReducer,
  domainsList: container.domainsListReducer,
  visitsOverview: container.visitsOverviewReducer,
  appUpdated: appUpdatesReducer,
  sidebar: sidebarReducer,
});
