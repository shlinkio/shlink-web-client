import React, { useEffect } from 'react';
import { isEmpty, values } from 'ramda';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Home.scss';
import ServersListGroup from '../servers/ServersListGroup';

const propTypes = {
  resetSelectedServer: PropTypes.func,
  servers: PropTypes.object,
};

const Home = ({ resetSelectedServer, servers }) => {
  const serversList = values(servers);
  const hasServers = !isEmpty(serversList);

  useEffect(() => {
    resetSelectedServer();
  }, []);

  return (
    <div className="home">
      <h1 className="home__title">Welcome to Shlink</h1>
      <ServersListGroup servers={serversList}>
        {hasServers && <span>Please, select a server.</span>}
        {!hasServers && <span>Please, <Link to="/server/create">add a server</Link>.</span>}
      </ServersListGroup>
    </div>
  );
};

Home.propTypes = propTypes;

export default Home;
