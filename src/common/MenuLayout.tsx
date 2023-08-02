import type { FC } from 'react';
import { useEffect } from 'react';
import type { Settings } from '../../shlink-web-component/src';
import { ShlinkWebComponent } from '../../shlink-web-component/src';
import type { ShlinkApiClientBuilder } from '../api/services/ShlinkApiClientBuilder';
import { isReachableServer } from '../servers/data';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import { NotFound } from './NotFound';
import './MenuLayout.scss';

interface MenuLayoutProps {
  sidebarPresent: Function;
  sidebarNotPresent: Function;
  settings: Settings;
}

// FIXME Rename this to something else
export const MenuLayout = (
  buildShlinkApiClient: ShlinkApiClientBuilder,
  ServerError: FC,
) => withSelectedServer<MenuLayoutProps>(({ selectedServer, sidebarNotPresent, sidebarPresent, settings }) => {
  const showContent = isReachableServer(selectedServer);
  const routesPrefix = showContent ? `/server/${selectedServer.id}` : '';

  useEffect(() => {
    showContent && sidebarPresent();
    return () => sidebarNotPresent();
  }, []);

  if (!showContent) {
    return <ServerError />;
  }

  return (
    <ShlinkWebComponent
      serverVersion={selectedServer.version}
      apiClient={buildShlinkApiClient(selectedServer)}
      settings={settings}
      routesPrefix={routesPrefix}
      createNotFound={(nonPrefixedHomePath) => (
        <NotFound to={`${routesPrefix}${nonPrefixedHomePath}`}>List short URLs</NotFound>
      )}
    />
  );
}, ServerError);
