import type { Store } from '@reduxjs/toolkit';
import type Bottle from 'bottlejs';
import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import type { SemVer } from '../utils/helpers/version';
import type { ShlinkApiClient } from './api-contract';
import { setUpStore } from './container/store';
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

export const createShlinkWebComponent = (
  bottle: Bottle,
): FC<ShlinkWebComponentProps> => ({ routesPrefix = '', serverVersion, settings, apiClient }) => {
  const features = useFeatures(serverVersion);
  const mainContent = useRef<ReactNode>();
  const [theStore, setStore] = useState<Store | undefined>();

  useEffect(() => {
    bottle.constant('apiClient', apiClient);

    // It's important to not try to resolve services before the API client has been registered, as many other services
    // depend on it
    const { container } = bottle;
    const { Main } = container;
    mainContent.current = <Main />;
    setStore(setUpStore(container));
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
