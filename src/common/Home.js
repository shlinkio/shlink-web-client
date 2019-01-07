import { faChevronRight as chevronIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty, values } from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import './Home.scss';

export default class Home extends React.Component {
  static propTypes = {
    resetSelectedServer: PropTypes.func,
    servers: PropTypes.object,
  };

  componentDidMount() {
    this.props.resetSelectedServer();
  }

  render() {
    const servers = values(this.props.servers);
    const hasServers = !isEmpty(servers);

    return (
      <div className="home">
        <h1 className="home__title">Welcome to Shlink</h1>
        <h5 className="home__intro">
          {hasServers && <span>Please, select a server.</span>}
          {!hasServers && <span>Please, <Link to="/server/create">add a server</Link>.</span>}
        </h5>

        {hasServers && (
          <ListGroup className="home__servers-list">
            {servers.map(({ name, id }) => (
              <ListGroupItem
                key={id}
                tag={Link}
                to={`/server/${id}/list-short-urls/1`}
                className="home__servers-item"
              >
                {name}
                <FontAwesomeIcon icon={chevronIcon} className="home__servers-item-icon" />
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </div>
    );
  }
}
