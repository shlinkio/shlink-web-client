import { combineReducers } from 'redux';
import serversReducer from '../servers/reducers/server';
import selectedServerReducer from '../servers/reducers/selectedServer';
import shortUrlsListReducer from '../short-urls/reducers/shortUrlsList';
import shortUrlsListParamsReducer from '../short-urls/reducers/shortUrlsListParams';
import shortUrlCreationReducer from '../short-urls/reducers/shortUrlCreation';
import shortUrlDeletionReducer from '../short-urls/reducers/shortUrlDeletion';
import shortUrlTagsReducer from '../short-urls/reducers/shortUrlTags';
import shortUrlMetaReducer from '../short-urls/reducers/shortUrlMeta';
import shortUrlVisitsReducer from '../visits/reducers/shortUrlVisits';
import shortUrlDetailReducer from '../visits/reducers/shortUrlDetail';
import tagsListReducer from '../tags/reducers/tagsList';
import tagDeleteReducer from '../tags/reducers/tagDelete';
import tagEditReducer from '../tags/reducers/tagEdit';

export default combineReducers({
  servers: serversReducer,
  selectedServer: selectedServerReducer,
  shortUrlsList: shortUrlsListReducer,
  shortUrlsListParams: shortUrlsListParamsReducer,
  shortUrlCreationResult: shortUrlCreationReducer,
  shortUrlDeletion: shortUrlDeletionReducer,
  shortUrlTags: shortUrlTagsReducer,
  shortUrlMeta: shortUrlMetaReducer,
  shortUrlVisits: shortUrlVisitsReducer,
  shortUrlDetail: shortUrlDetailReducer,
  tagsList: tagsListReducer,
  tagDelete: tagDeleteReducer,
  tagEdit: tagEditReducer,
});
