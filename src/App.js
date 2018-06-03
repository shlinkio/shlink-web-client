import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.scss';
import Home from './common/Home';
import MainHeader from './common/MainHeader';
import MenuLayout from './common/MenuLayout';
import CreateServer from './servers/CreateServer';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <MainHeader/>

        <div className="app">
          <Switch>
            <Route exact path="/server/create" component={CreateServer} />
            <Route exact path="/" component={Home} />
            <Route component={MenuLayout} />
          </Switch>
        </div>
      </div>
    );
  }
}
