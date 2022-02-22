import { useEffect, FC } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import NotFound from '../common/NotFound';
import { ServersMap } from '../servers/data';
import { Settings } from '../settings/reducers/settings';
import { changeThemeInMarkup } from '../utils/theme';
import { AppUpdateBanner } from '../common/AppUpdateBanner';
import { forceUpdate } from '../utils/helpers/sw';
import './App.scss';

interface AppProps {
  fetchServers: () => void;
  servers: ServersMap;
  settings: Settings;
  resetAppUpdate: () => void;
  appUpdated: boolean;
}

const App = (
  MainHeader: FC,
  Home: FC,
  MenuLayout: FC,
  CreateServer: FC,
  EditServer: FC,
  Settings: FC,
  ManageServers: FC,
  ShlinkVersionsContainer: FC,
) => ({ fetchServers, servers, settings, appUpdated, resetAppUpdate }: AppProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    // On first load, try to fetch the remote servers if the list is empty
    if (Object.keys(servers).length === 0) {
      fetchServers();
    }

    changeThemeInMarkup(settings.ui?.theme ?? 'light');
  }, []);

  return (
    <div className="container-fluid app-container">
      <MainHeader />

      <div className="app">
        <div className={classNames('shlink-wrapper', { 'd-flex d-md-block align-items-center': isHome })}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/manage-servers" element={<ManageServers />} />
            <Route path="/server/create" element={<CreateServer />} />
            <Route path="/server/:serverId/edit" element={<EditServer />} />
            <Route path="/server/:serverId/*" element={<MenuLayout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <div className="shlink-footer">
          <ShlinkVersionsContainer />
        </div>
      </div>

      <AppUpdateBanner isOpen={appUpdated} toggle={resetAppUpdate} forceUpdate={forceUpdate} />
    </div>
  );
};

export default App;
