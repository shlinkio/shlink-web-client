import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.scss';
import NotFound from './common/NotFound';

const App = (MainHeader, Home, MenuLayout, CreateServer) => () => (
  <div className="container-fluid app-container">
    <MainHeader />

    <div className="app">
      <Switch>
        <Route exact path="/server/create" component={CreateServer} />
        <Route exact path="/" component={Home} />
        <Route path="/server/:serverId" component={MenuLayout} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </div>
);

export default App;
