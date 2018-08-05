import { combineReducers } from 'redux';

import serversReducer from '../servers/reducers/server';
import selectedServerReducer from '../servers/reducers/selectedServer';
import shortUrlsListReducer from '../short-urls/reducers/shortUrlsList';
import shortUrlsListParamsReducer from '../short-urls/reducers/shortUrlsListParams';
import shortUrlCreationResultReducer from '../short-urls/reducers/shortUrlCreationResult';
import shortUrlVisitsReducer from '../short-urls/reducers/shortUrlVisits';

export default combineReducers({
  servers: serversReducer,
  selectedServer: selectedServerReducer,
  shortUrlsList: shortUrlsListReducer,
  shortUrlsListParams: shortUrlsListParamsReducer,
  shortUrlCreationResult: shortUrlCreationResultReducer,
  shortUrlVisits: shortUrlVisitsReducer
});
