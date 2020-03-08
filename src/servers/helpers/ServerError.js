import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Message from '../../utils/Message';
import ServersListGroup from '../ServersListGroup';
import './ServerError.scss';

const propTypes = {
  type: PropTypes.oneOf([ 'not-found', 'not-reachable' ]).isRequired,
};

export const ServerError = ({ type }) => (
  <div className="server-error-container flex-column">
    <div className="row w-100">
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
    <ServersListGroup servers={[]} className="mt-3 mt-md-5">
      These are the {type === 'not-reachable' ? 'other' : ''} servers currently configured. Choose one of
      them or <Link to="/server/create">add a new one</Link>.
    </ServersListGroup>
  </div>
);

ServerError.propTypes = propTypes;
