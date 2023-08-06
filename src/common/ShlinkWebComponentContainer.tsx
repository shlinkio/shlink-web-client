import type { Settings, ShlinkWebComponentType, TagColorsStorage } from '@shlinkio/shlink-web-component';
import type { FC } from 'react';
import { useEffect } from 'react';
import type { ShlinkApiClientBuilder } from '../api/services/ShlinkApiClientBuilder';
import { isReachableServer } from '../servers/data';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import { NotFound } from './NotFound';
import './ShlinkWebComponentContainer.scss';

interface ShlinkWebComponentContainerProps {
  sidebarPresent: Function;
  sidebarNotPresent: Function;
  settings: Settings;
}

export const ShlinkWebComponentContainer = (
  buildShlinkApiClient: ShlinkApiClientBuilder,
  tagColorsStorage: TagColorsStorage,
  ShlinkWebComponent: ShlinkWebComponentType,
  ServerError: FC,
) => withSelectedServer<ShlinkWebComponentContainerProps>((
  { selectedServer, sidebarNotPresent, sidebarPresent, settings },
) => {
  const selectedServerIsReachable = isReachableServer(selectedServer);
  const routesPrefix = selectedServerIsReachable ? `/server/${selectedServer.id}` : '';

  useEffect(() => {
    selectedServerIsReachable && sidebarPresent();
    return () => sidebarNotPresent();
  }, []);

  if (!selectedServerIsReachable) {
    return <ServerError />;
  }

  return (
    <ShlinkWebComponent
      serverVersion={selectedServer.version}
      apiClient={buildShlinkApiClient(selectedServer)}
      settings={settings}
      routesPrefix={routesPrefix}
      tagColorsStorage={tagColorsStorage}
      createNotFound={(nonPrefixedHomePath) => (
        <NotFound to={`${routesPrefix}${nonPrefixedHomePath}`}>List short URLs</NotFound>
      )}
    />
  );
}, ServerError);
