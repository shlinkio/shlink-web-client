import { IContainer } from 'bottlejs';
import { combineReducers } from 'redux';
import { serversReducer } from '../servers/reducers/servers';
import selectedServerReducer from '../servers/reducers/selectedServer';
import shortUrlVisitsReducer from '../visits/reducers/shortUrlVisits';
import tagVisitsReducer from '../visits/reducers/tagVisits';
import domainVisitsReducer from '../visits/reducers/domainVisits';
import orphanVisitsReducer from '../visits/reducers/orphanVisits';
import nonOrphanVisitsReducer from '../visits/reducers/nonOrphanVisits';
import { settingsReducer } from '../settings/reducers/settings';
import visitsOverviewReducer from '../visits/reducers/visitsOverview';
import { appUpdatesReducer } from '../app/reducers/appUpdates';
import { sidebarReducer } from '../common/reducers/sidebar';
import { ShlinkState } from '../container/types';

export default (container: IContainer) => combineReducers<ShlinkState>({
  servers: serversReducer,
  selectedServer: selectedServerReducer,
  shortUrlsList: container.shortUrlsListReducer,
  shortUrlCreation: container.shortUrlCreationReducer,
  shortUrlDeletion: container.shortUrlDeletionReducer,
  shortUrlEdition: container.shortUrlEditionReducer,
  shortUrlDetail: container.shortUrlDetailReducer,
  shortUrlVisits: shortUrlVisitsReducer,
  tagVisits: tagVisitsReducer,
  domainVisits: domainVisitsReducer,
  orphanVisits: orphanVisitsReducer,
  nonOrphanVisits: nonOrphanVisitsReducer,
  tagsList: container.tagsListReducer,
  tagDelete: container.tagDeleteReducer,
  tagEdit: container.tagEditReducer,
  mercureInfo: container.mercureInfoReducer,
  settings: settingsReducer,
  domainsList: container.domainsListReducer,
  visitsOverview: visitsOverviewReducer,
  appUpdated: appUpdatesReducer,
  sidebar: sidebarReducer,
});
