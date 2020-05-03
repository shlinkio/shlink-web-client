import ReduxThunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import { save, load } from 'redux-localstorage-simple';
import reducers from '../reducers';

const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

const localStorageConfig = {
  states: [ 'settings', 'servers' ],
  namespace: 'shlink',
  namespaceSeparator: '.',
  debounce: 300,
};

const store = createStore(reducers, load(localStorageConfig), composeEnhancers(
  applyMiddleware(save(localStorageConfig), ReduxThunk)
));

export default store;
