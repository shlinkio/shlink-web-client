import { IContainer } from 'bottlejs';
import { combineReducers } from 'redux';
import serversReducer from '../servers/reducers/servers';
import selectedServerReducer from '../servers/reducers/selectedServer';
import shortUrlsListReducer from '../short-urls/reducers/shortUrlsList';
import shortUrlCreationReducer from '../short-urls/reducers/shortUrlCreation';
import shortUrlDeletionReducer from '../short-urls/reducers/shortUrlDeletion';
import shortUrlEditionReducer from '../short-urls/reducers/shortUrlEdition';
import shortUrlVisitsReducer from '../visits/reducers/shortUrlVisits';
import tagVisitsReducer from '../visits/reducers/tagVisits';
import domainVisitsReducer from '../visits/reducers/domainVisits';
import orphanVisitsReducer from '../visits/reducers/orphanVisits';
import nonOrphanVisitsReducer from '../visits/reducers/nonOrphanVisits';
import shortUrlDetailReducer from '../short-urls/reducers/shortUrlDetail';
import tagsListReducer from '../tags/reducers/tagsList';
import tagDeleteReducer from '../tags/reducers/tagDelete';
import tagEditReducer from '../tags/reducers/tagEdit';
import mercureInfoReducer from '../mercure/reducers/mercureInfo';
import settingsReducer from '../settings/reducers/settings';
import visitsOverviewReducer from '../visits/reducers/visitsOverview';
import { appUpdatesReducer } from '../app/reducers/appUpdates';
import { sidebarReducer } from '../common/reducers/sidebar';
import { ShlinkState } from '../container/types';

export default (container: IContainer) => combineReducers<ShlinkState>({
  servers: serversReducer,
  selectedServer: selectedServerReducer,
  shortUrlsList: shortUrlsListReducer,
  shortUrlCreationResult: shortUrlCreationReducer,
  shortUrlDeletion: shortUrlDeletionReducer,
  shortUrlEdition: shortUrlEditionReducer,
  shortUrlVisits: shortUrlVisitsReducer,
  tagVisits: tagVisitsReducer,
  domainVisits: domainVisitsReducer,
  orphanVisits: orphanVisitsReducer,
  nonOrphanVisits: nonOrphanVisitsReducer,
  shortUrlDetail: shortUrlDetailReducer,
  tagsList: tagsListReducer,
  tagDelete: tagDeleteReducer,
  tagEdit: tagEditReducer,
  mercureInfo: mercureInfoReducer,
  settings: settingsReducer,
  domainsList: container.domainsListReducer,
  visitsOverview: visitsOverviewReducer,
  appUpdated: appUpdatesReducer,
  sidebar: sidebarReducer,
});
