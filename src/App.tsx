import { useEffect, FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './common/NotFound';
import { ServersMap } from './servers/data';
import { Settings } from './settings/reducers/settings';
import { changeThemeInMarkup } from './utils/theme';
import './App.scss';

interface AppProps {
  fetchServers: Function;
  servers: ServersMap;
  settings: Settings;
}

const App = (
  MainHeader: FC,
  Home: FC,
  MenuLayout: FC,
  CreateServer: FC,
  EditServer: FC,
  Settings: FC,
  ShlinkVersionsContainer: FC,
) => ({ fetchServers, servers, settings }: AppProps) => {
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
        <div className="shlink-wrapper">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/server/create" component={CreateServer} />
            <Route exact path="/server/:serverId/edit" component={EditServer} />
            <Route path="/server/:serverId" component={MenuLayout} />
            <Route component={NotFound} />
          </Switch>
        </div>

        <div className="shlink-footer">
          <ShlinkVersionsContainer />
        </div>
      </div>
    </div>
  );
};

export default App;
