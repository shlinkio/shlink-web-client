import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.scss';
import MenuLayout from './common/MenuLayout';
import CreateServer from './servers/CreateServer';

const App = (MainHeader, Home) => () => (
  <div className="container-fluid app-container">
    <MainHeader />

    <div className="app">
      <Switch>
        <Route exact path="/server/create" component={CreateServer} />
        <Route exact path="/" component={Home} />
        <Route path="/server/:serverId" component={MenuLayout} />
      </Switch>
    </div>
  </div>
);

export default App;
