import { combineReducers } from 'redux';

import serversReducer from '../servers/reducers/server';
import selectedServerReducer from '../servers/reducers/selectedServer';

const rootReducer = combineReducers({
  servers: serversReducer,
  selectedServer: selectedServerReducer,
});

export default rootReducer;
