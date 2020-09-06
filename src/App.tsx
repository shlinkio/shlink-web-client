import React, { useEffect, FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './common/NotFound';
import { ServersMap } from './servers/data';
import './App.scss';

interface AppProps {
  fetchServers: Function;
  servers: ServersMap;
}

const App = (
  MainHeader: FC,
  Home: FC,
  MenuLayout: FC,
  CreateServer: FC,
  EditServer: FC,
  Settings: FC,
  ShlinkVersions: FC,
) => ({ fetchServers, servers }: AppProps) => {
  // On first load, try to fetch the remote servers if the list is empty
  useEffect(() => {
    if (Object.keys(servers).length === 0) {
      fetchServers();
    }
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

        <div className="shlink-footer text-center text-md-right">
          <ShlinkVersions />
        </div>
      </div>
    </div>
  );
};

export default App;
