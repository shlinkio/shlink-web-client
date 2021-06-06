import { combineReducers } from 'redux';
import serversReducer from '../servers/reducers/servers';
import selectedServerReducer from '../servers/reducers/selectedServer';
import shortUrlsListReducer from '../short-urls/reducers/shortUrlsList';
import shortUrlsListParamsReducer from '../short-urls/reducers/shortUrlsListParams';
import shortUrlCreationReducer from '../short-urls/reducers/shortUrlCreation';
import shortUrlDeletionReducer from '../short-urls/reducers/shortUrlDeletion';
import shortUrlEditionReducer from '../short-urls/reducers/shortUrlEdition';
import shortUrlVisitsReducer from '../visits/reducers/shortUrlVisits';
import tagVisitsReducer from '../visits/reducers/tagVisits';
import orphanVisitsReducer from '../visits/reducers/orphanVisits';
import shortUrlDetailReducer from '../short-urls/reducers/shortUrlDetail';
import tagsListReducer from '../tags/reducers/tagsList';
import tagDeleteReducer from '../tags/reducers/tagDelete';
import tagEditReducer from '../tags/reducers/tagEdit';
import mercureInfoReducer from '../mercure/reducers/mercureInfo';
import settingsReducer from '../settings/reducers/settings';
import domainsListReducer from '../domains/reducers/domainsList';
import visitsOverviewReducer from '../visits/reducers/visitsOverview';
import appUpdatesReducer from '../app/reducers/appUpdates';
import { ShlinkState } from '../container/types';

export default combineReducers<ShlinkState>({
  servers: serversReducer,
  selectedServer: selectedServerReducer,
  shortUrlsList: shortUrlsListReducer,
  shortUrlsListParams: shortUrlsListParamsReducer,
  shortUrlCreationResult: shortUrlCreationReducer,
  shortUrlDeletion: shortUrlDeletionReducer,
  shortUrlEdition: shortUrlEditionReducer,
  shortUrlVisits: shortUrlVisitsReducer,
  tagVisits: tagVisitsReducer,
  orphanVisits: orphanVisitsReducer,
  shortUrlDetail: shortUrlDetailReducer,
  tagsList: tagsListReducer,
  tagDelete: tagDeleteReducer,
  tagEdit: tagEditReducer,
  mercureInfo: mercureInfoReducer,
  settings: settingsReducer,
  domainsList: domainsListReducer,
  visitsOverview: visitsOverviewReducer,
  appUpdated: appUpdatesReducer,
});
