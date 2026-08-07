import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { RLSOptions } from 'redux-localstorage-simple';
import { load, save } from 'redux-localstorage-simple';
import { migrateDeprecatedSettings } from '../settings/helpers';
import { initReducers } from './reducers';

const localStorageConfig: RLSOptions = {
  states: ['settings', 'servers'],
  namespace: 'shlink',
  namespaceSeparator: '.',
  debounce: 300,
};
const getStateFromLocalStorage = () => migrateDeprecatedSettings(load(localStorageConfig));

const isProduction = process.env.NODE_ENV === 'production';
export const setUpStore = (preloadedState = getStateFromLocalStorage()) =>
  configureStore({
    devTools: !isProduction,
    reducer: initReducers(),
    preloadedState,
    middleware: (defaultMiddlewaresIncludingReduxThunk) =>
      defaultMiddlewaresIncludingReduxThunk().concat(save(localStorageConfig)),
  });

export type StoreType = ReturnType<typeof setUpStore>;
export type AppDispatch = StoreType['dispatch'];
export type GetState = StoreType['getState'];
export type RootState = ReturnType<GetState>;

// Typed versions of useDispatch() and useSelector()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
