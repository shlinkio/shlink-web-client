import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Message from '../../utils/Message';
import ServersListGroup from '../ServersListGroup';
import './ServerError.scss';

const propTypes = {
  servers: PropTypes.object,
  type: PropTypes.oneOf([ 'not-found', 'not-reachable' ]).isRequired,
};

export const ServerError = ({ type, servers: { list } }) => (
  <div className="server-error-container flex-column">
    <div className="row w-100 mb-3 mb-md-5">
      <Message type="error">
        {type === 'not-found' && 'Could not find this Shlink server.'}
        {type === 'not-reachable' && (
          <React.Fragment>
            <p>Oops! Could not connect to this Shlink server.</p>
            Make sure you have internet connection, and the server is properly configured and on-line.
          </React.Fragment>
        )}
      </Message>
    </div>
    <ServersListGroup servers={Object.values(list)}>
      These are the {type === 'not-reachable' ? 'other' : ''} Shlink servers currently configured. Choose one of
      them or <Link to="/server/create">add a new one</Link>.
    </ServersListGroup>
  </div>
);

ServerError.propTypes = propTypes;
