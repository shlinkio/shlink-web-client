import React from 'react';
import './App.scss';
import { Route, Switch } from 'react-router-dom';
import Home from './common/Home';
import MainHeader from './common/MainHeader';
import CreateServer from './servers/CreateServer';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <MainHeader/>
        <div className="app">
          <Switch>
            <Route path="/server/create" component={CreateServer} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </div>
    );
  }
}
