import React, { useEffect, FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './common/NotFound';
import './App.scss';

interface AppProps {
  fetchServers: Function;
  servers: Record<string, object>;
}

const App = (MainHeader: FC, Home: FC, MenuLayout: FC, CreateServer: FC, EditServer: FC, Settings: FC) => (
  { fetchServers, servers }: AppProps,
) => {
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
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/server/create" component={CreateServer} />
          <Route exact path="/server/:serverId/edit" component={EditServer} />
          <Route path="/server/:serverId" component={MenuLayout} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
