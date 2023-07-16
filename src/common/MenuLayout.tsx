import type { FC } from 'react';
import { useEffect } from 'react';
import { isReachableServer } from '../servers/data';
import { withSelectedServer } from '../servers/helpers/withSelectedServer';
import type { ShlinkWebComponentType } from '../shlink-web-component';
import './MenuLayout.scss';

interface MenuLayoutProps {
  sidebarPresent: Function;
  sidebarNotPresent: Function;
}

export const MenuLayout = (
  ServerError: FC,
  ShlinkWebComponent: ShlinkWebComponentType,
) => withSelectedServer<MenuLayoutProps>(({ selectedServer, sidebarNotPresent, sidebarPresent }) => {
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
      routesPrefix={`/server/${selectedServer.id}`}
    />
  );
}, ServerError);
