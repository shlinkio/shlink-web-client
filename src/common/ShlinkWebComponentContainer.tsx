import type { Settings, ShlinkWebComponentType, TagColorsStorage } from '@shlinkio/shlink-web-component';
import type { FC } from 'react';
import type { ShlinkApiClientBuilder } from '../api/services/ShlinkApiClientBuilder';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import { isReachableServer } from '../servers/data';
import type { WithSelectedServerProps } from '../servers/helpers/withSelectedServer';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import { NotFound } from './NotFound';

type ShlinkWebComponentContainerProps = WithSelectedServerProps & {
  settings: Settings;
};

type ShlinkWebComponentContainerDeps = {
  buildShlinkApiClient: ShlinkApiClientBuilder,
  TagColorsStorage: TagColorsStorage,
  ShlinkWebComponent: ShlinkWebComponentType,
  ServerError: FC,
};

const ShlinkWebComponentContainer: FCWithDeps<
ShlinkWebComponentContainerProps,
ShlinkWebComponentContainerDeps
> = withSelectedServer(({ selectedServer, settings }) => {
  const {
    buildShlinkApiClient,
    TagColorsStorage: tagColorsStorage,
    ShlinkWebComponent,
    ServerError,
  } = useDependencies(ShlinkWebComponentContainer);
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
});

export const ShlinkWebComponentContainerFactory = componentFactory(ShlinkWebComponentContainer, [
  'buildShlinkApiClient',
  'TagColorsStorage',
  'ShlinkWebComponent',
  'ServerError',
]);
