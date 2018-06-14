import { combineReducers } from 'redux';

import serversReducer from './servers';

const rootReducer = combineReducers({
  servers: serversReducer
});

export default rootReducer;
