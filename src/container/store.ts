import ReduxThunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import { save, load, RLSOptions } from 'redux-localstorage-simple';
import reducers from '../reducers';
import { migrateDeprecatedSettings } from '../settings/helpers';
import { ShlinkState } from './types';

const isProduction = process.env.NODE_ENV === 'production';
// eslint-disable-next-line no-mixed-operators
const composeEnhancers: Function = !isProduction && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const localStorageConfig: RLSOptions = {
  states: ['settings', 'servers'],
  namespace: 'shlink',
  namespaceSeparator: '.',
  debounce: 300,
};
const preloadedState = migrateDeprecatedSettings(load(localStorageConfig) as ShlinkState);

export const store = createStore(reducers, preloadedState, composeEnhancers(
  applyMiddleware(save(localStorageConfig), ReduxThunk),
));
