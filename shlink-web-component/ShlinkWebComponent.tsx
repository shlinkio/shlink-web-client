import type { Store } from '@reduxjs/toolkit';
import type Bottle from 'bottlejs';
import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import type { SemVer } from '../src/utils/helpers/version';
import type { ShlinkApiClient } from './api-contract';
import { FeaturesProvider, useFeatures } from './utils/features';
import { RoutesPrefixProvider } from './utils/routesPrefix';
import type { Settings } from './utils/settings';
import { SettingsProvider } from './utils/settings';

type ShlinkWebComponentProps = {
  routesPrefix?: string;
  settings?: Settings;
  serverVersion: SemVer;
  apiClient: ShlinkApiClient;
};

// FIXME
// This allows to track the reference to be resolved by the container, but it's hacky and relies on not more than one
// ShlinkWebComponent rendered at the same time
let apiClientRef: ShlinkApiClient;

export const createShlinkWebComponent = (
  bottle: Bottle,
): FC<ShlinkWebComponentProps> => ({ routesPrefix = '', serverVersion, settings, apiClient }) => {
  const features = useFeatures(serverVersion);
  const mainContent = useRef<ReactNode>();
  const [theStore, setStore] = useState<Store | undefined>();

  // Set client on every re-render
  apiClientRef = apiClient;

  useEffect(() => {
    bottle.value('apiClientFactory', () => apiClientRef);

    // It's important to not try to resolve services before the API client has been registered, as many other services
    // depend on it
    const { container } = bottle;
    const { Main, store, loadMercureInfo } = container;
    mainContent.current = <Main />;
    setStore(store);

    // Load mercure info
    store.dispatch(loadMercureInfo());
  }, []);

  return !theStore ? <></> : (
    <Provider store={theStore}>
      <SettingsProvider value={settings}>
        <FeaturesProvider value={features}>
          <RoutesPrefixProvider value={routesPrefix}>
            {mainContent.current}
          </RoutesPrefixProvider>
        </FeaturesProvider>
      </SettingsProvider>
    </Provider>
  );
};
