import type { ShlinkWebComponentType, TagColorsStorage } from '@shlinkio/shlink-web-component';
import type { Settings } from '@shlinkio/shlink-web-component/settings';
import type { FC } from 'react';
import { memo } from 'react';
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
// FIXME Using `memo` here to solve a flickering effect in charts.
//       memo is probably not the right solution. The root cause is the withSelectedServer HOC, but I couldn't fix the
//       extra rendering there.
//       This should be revisited at some point.
> = withSelectedServer(memo(({ selectedServer, settings }) => {
  const {
    buildShlinkApiClient,
    TagColorsStorage: tagColorsStorage,
    ShlinkWebComponent,
    ServerError,
  } = useDependencies(ShlinkWebComponentContainer);

  if (!isReachableServer(selectedServer)) {
    return <ServerError />;
  }

  const routesPrefix = `/server/${selectedServer.id}`;
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
}));

export const ShlinkWebComponentContainerFactory = componentFactory(ShlinkWebComponentContainer, [
  'buildShlinkApiClient',
  'TagColorsStorage',
  'ShlinkWebComponent',
  'ServerError',
]);
