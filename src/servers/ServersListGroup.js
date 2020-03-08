import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight as chevronIcon } from '@fortawesome/free-solid-svg-icons';
import { serverType } from './prop-types';
import './ServersListGroup.scss';

const propTypes = {
  servers: PropTypes.arrayOf(serverType).isRequired,
  children: PropTypes.node.isRequired,
};

const ServerListItem = ({ id, name }) => (
  <ListGroupItem tag={Link} to={`/server/${id}/list-short-urls/1`} className="servers-list__server-item">
    {name}
    <FontAwesomeIcon icon={chevronIcon} className="servers-list__server-item-icon" />
  </ListGroupItem>
);

ServerListItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
};

const ServersListGroup = ({ servers, children }) => (
  <React.Fragment>
    <h5>{children}</h5>
    {servers.length > 0 && (
      <ListGroup className="servers-list__list-group mt-md-3">
        {servers.map(({ id, name }) => <ServerListItem key={id} id={id} name={name} />)}
      </ListGroup>
    )}
  </React.Fragment>
);

ServersListGroup.propTypes = propTypes;

export default ServersListGroup;
