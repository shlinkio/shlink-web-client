import type { FC } from 'react';
import { useEffect } from 'react';
import { isReachableServer } from '../servers/data';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import { ShlinkWebComponent } from '../shlink-web-component';
import type { Settings } from '../shlink-web-component/utils/settings';
import './MenuLayout.scss';

interface MenuLayoutProps {
  sidebarPresent: Function;
  sidebarNotPresent: Function;
  settings: Settings;
}

export const MenuLayout = (
  ServerError: FC,
) => withSelectedServer<MenuLayoutProps>(({ selectedServer, sidebarNotPresent, sidebarPresent, settings }) => {
  const showContent = isReachableServer(selectedServer);

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
      settings={settings}
      routesPrefix={`/server/${selectedServer.id}`}
    />
  );
}, ServerError);
