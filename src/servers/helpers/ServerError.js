import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Message from '../../utils/Message';
import ServersListGroup from '../ServersListGroup';
import { serverType } from '../prop-types';
import './ServerError.scss';

const propTypes = {
  servers: PropTypes.object,
  selectedServer: serverType,
  type: PropTypes.oneOf([ 'not-found', 'not-reachable' ]).isRequired,
};

export const ServerError = (DeleteServerButton) => {
  const ServerErrorComp = ({ type, servers: { list }, selectedServer }) => (
    <div className="server-error__container flex-column">
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
        These are the Shlink servers currently configured. Choose one of
        them or <Link to="/server/create">add a new one</Link>.
      </ServersListGroup>

      {type === 'not-reachable' && (
        <div className="container mt-3 mt-md-5">
          <h5>
            Alternatively, if you think you may have miss-configured this server, you
            can <DeleteServerButton server={selectedServer} className="server-error__delete-btn">remove it</DeleteServerButton> or&nbsp;
            <Link to={`/server/${selectedServer.id}/edit`}>edit it</Link>.
          </h5>
        </div>
      )}
    </div>
  );

  ServerErrorComp.propTypes = propTypes;

  return ServerErrorComp;
};
