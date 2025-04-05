import { changeThemeInMarkup, getSystemPreferredTheme } from '@shlinkio/shlink-frontend-kit';
import type { Settings } from '@shlinkio/shlink-web-component/settings';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { AppUpdateBanner } from '../common/AppUpdateBanner';
import { NotFound } from '../common/NotFound';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import type { ServersMap } from '../servers/data';
import { forceUpdate } from '../utils/helpers/sw';

type AppProps = {
  fetchServers: () => void;
  servers: ServersMap;
  settings: Settings;
  resetAppUpdate: () => void;
  appUpdated: boolean;
};

type AppDeps = {
  MainHeader: FC;
  Home: FC;
  ShlinkWebComponentContainer: FC;
  CreateServer: FC;
  EditServer: FC;
  Settings: FC;
  ManageServers: FC;
  ShlinkVersionsContainer: FC;
};

const App: FCWithDeps<AppProps, AppDeps> = (
  { fetchServers, servers, settings, appUpdated, resetAppUpdate },
) => {
  const {
    MainHeader,
    Home,
    ShlinkWebComponentContainer,
    CreateServer,
    EditServer,
    Settings,
    ManageServers,
    ShlinkVersionsContainer,
  } = useDependencies(App);

  const location = useLocation();
  const initialServers = useRef(servers);
  const isHome = location.pathname === '/';

  useEffect(() => {
    // Try to fetch the remote servers if the list is empty during first render.
    // We use a ref because we don't care if the servers list becomes empty later.
    if (Object.keys(initialServers.current).length === 0) {
      fetchServers();
    }
  }, [fetchServers]);

  useEffect(() => {
    changeThemeInMarkup(settings.ui?.theme ?? getSystemPreferredTheme());
  }, [settings.ui?.theme]);

  return (
    <div className="tw:px-3 tw:h-full">
      <MainHeader />

      <div className="tw:h-full tw:pt-(--header-height)">
        <div
          className={clsx(
            'tw:min-h-full tw:pb-[calc(var(--footer-height)+var(--footer-margin))] tw:-mb-[calc(var(--footer-height)+var(--footer-margin))]',
            { 'tw:flex tw:items-center tw:pt-4': isHome },
          )}
        >
          <Routes>
            <Route index element={<Home />} />
            <Route path="/settings">
              {['', '*'].map((path) => <Route key={path} path={path} element={<Settings />} />)}
            </Route>
            <Route path="/manage-servers" element={<ManageServers />} />
            <Route path="/server/create" element={<CreateServer />} />
            <Route path="/server/:serverId/edit" element={<EditServer />} />
            <Route path="/server/:serverId">
              {['', '*'].map((path) => <Route key={path} path={path} element={<ShlinkWebComponentContainer />} />)}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <div className="tw:h-(--footer-height) tw:mt-(--footer-margin) tw:md:px-4">
          <ShlinkVersionsContainer />
        </div>
      </div>

      <AppUpdateBanner isOpen={appUpdated} onClose={resetAppUpdate} forceUpdate={forceUpdate} />
    </div>
  );
};

export const AppFactory = componentFactory(App, [
  'MainHeader',
  'Home',
  'ShlinkWebComponentContainer',
  'CreateServer',
  'EditServer',
  'Settings',
  'ManageServers',
  'ShlinkVersionsContainer',
]);
