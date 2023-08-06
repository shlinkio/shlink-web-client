import type { Settings, ShlinkWebComponentType, TagColorsStorage } from '@shlinkio/shlink-web-component';
import type { FC } from 'react';
import type { ShlinkApiClientBuilder } from '../api/services/ShlinkApiClientBuilder';
import { isReachableServer } from '../servers/data';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import { NotFound } from './NotFound';
import './ShlinkWebComponentContainer.scss';

interface ShlinkWebComponentContainerProps {
  settings: Settings;
}

export const ShlinkWebComponentContainer = (
  buildShlinkApiClient: ShlinkApiClientBuilder,
  tagColorsStorage: TagColorsStorage,
  ShlinkWebComponent: ShlinkWebComponentType,
  ServerError: FC,
) => withSelectedServer<ShlinkWebComponentContainerProps>(({ selectedServer, settings }) => {
  const selectedServerIsReachable = isReachableServer(selectedServer);
  const routesPrefix = selectedServerIsReachable ? `/server/${selectedServer.id}` : '';

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
