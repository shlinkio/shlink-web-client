import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Message from '../../utils/Message';
import { serverType } from '../prop-types';

const propTypes = {
  selectServer: PropTypes.func,
  selectedServer: serverType,
  match: PropTypes.object,
};

export const withSelectedServer = (WrappedComponent, ServerError) => {
  const Component = (props) => {
    const { selectServer, selectedServer, match } = props;
    const { params: { serverId } } = match;

    useEffect(() => {
      selectServer(serverId);
    }, [ serverId ]);

    if (!selectedServer) {
      return <Message loading />;
    }

    if (selectedServer.serverNotFound) {
      return <ServerError type="not-found" />;
    }

    return <WrappedComponent {...props} />;
  };

  Component.propTypes = propTypes;

  return Component;
};
