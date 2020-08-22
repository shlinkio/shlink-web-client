import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import NotFound from './common/NotFound';
import './App.scss';

const propTypes = {
  fetchServers: PropTypes.func,
  servers: PropTypes.object,
};

const App = (MainHeader, Home, MenuLayout, CreateServer, EditServer, Settings) => {
  const AppComp = ({ fetchServers, servers }) => {
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

  AppComp.propTypes = propTypes;

  return AppComp;
};

export default App;
