import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './common/NotFound';
import './App.scss';

const App = (MainHeader, Home, MenuLayout, CreateServer, EditServer, Settings) => ({ loadRealTimeUpdates }) => {
  useEffect(() => {
    loadRealTimeUpdates();
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
