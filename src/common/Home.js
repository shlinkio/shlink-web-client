import { isEmpty, values } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Home.scss';
import ServersListGroup from '../servers/ServersListGroup';

export default class Home extends React.Component {
  static propTypes = {
    resetSelectedServer: PropTypes.func,
    servers: PropTypes.object,
  };

  componentDidMount() {
    this.props.resetSelectedServer();
  }

  render() {
    const { servers: { list, loading } } = this.props;
    const servers = values(list);
    const hasServers = !isEmpty(servers);

    return (
      <div className="home">
        <h1 className="home__title">Welcome to Shlink</h1>
        <ServersListGroup servers={servers}>
          {!loading && hasServers && <span>Please, select a server.</span>}
          {!loading && !hasServers && <span>Please, <Link to="/server/create">add a server</Link>.</span>}
          {loading && <span>Trying to load servers...</span>}
        </ServersListGroup>
      </div>
    );
  }
}
