import { save, load, RLSOptions } from 'redux-localstorage-simple';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../reducers';
import { migrateDeprecatedSettings } from '../settings/helpers';
import { ShlinkState } from './types';

const isProduction = process.env.NODE_ENV === 'production';
const localStorageConfig: RLSOptions = {
  states: ['settings', 'servers'],
  namespace: 'shlink',
  namespaceSeparator: '.',
  debounce: 300,
};
const preloadedState = migrateDeprecatedSettings(load(localStorageConfig) as ShlinkState);

export const store = configureStore({
  devTools: !isProduction,
  reducer,
  preloadedState,
  middleware: (defaultMiddlewaresIncludingReduxThunk) => defaultMiddlewaresIncludingReduxThunk(
    { immutableCheck: false, serializableCheck: false }, // State is too big for these
  ).concat(save(localStorageConfig)),
});
