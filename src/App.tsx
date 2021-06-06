import { useEffect, FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Alert } from 'reactstrap';
import NotFound from './common/NotFound';
import { ServersMap } from './servers/data';
import { Settings } from './settings/reducers/settings';
import { changeThemeInMarkup } from './utils/theme';
import { SimpleCard } from './utils/SimpleCard';
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
  ShlinkVersionsContainer: FC,
) => ({ fetchServers, servers, settings, appUpdated, resetAppUpdate }: AppProps) => {
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

      <Alert
        className="app__update-banner"
        tag={SimpleCard}
        color="secondary"
        isOpen={appUpdated}
        toggle={resetAppUpdate}
      >
        <h4 className="mb-4">This app has just been updated!</h4>
        <p className="mb-0">Restart it to enjoy the new features.</p>
      </Alert>
    </div>
  );
};

export default App;
