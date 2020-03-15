import React, { useEffect } from 'react';
import PropTypes, { serverType } from 'prop-types';
import './CreateServer.scss';
import Message from '../utils/Message';
import { ServerForm } from './helpers/ServerForm';

const propTypes = {
  editServer: PropTypes.func,
  selectServer: PropTypes.func,
  selectedServer: serverType,
  match: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export const EditServer = (ServerError) => {
  const EditServerComp = ({ editServer, selectServer, selectedServer, match, history: { push } }) => {
    const { params: { serverId } } = match;
    const handleSubmit = (serverData) => {
      editServer(serverId, serverData);
      push(`/server/${serverId}/list-short-urls/1`);
    };

    useEffect(() => {
      selectServer(serverId);
    }, [ serverId ]);

    if (!selectedServer) {
      return <Message loading />;
    }

    if (selectedServer.serverNotFound) {
      return <ServerError type="not-found" />;
    }

    return (
      <div className="create-server">
        <ServerForm initialValues={selectedServer} onSubmit={handleSubmit}>
          <button className="btn btn-outline-primary">Save</button>
        </ServerForm>
      </div>
    );
  };

  EditServerComp.propTypes = propTypes;

  return EditServerComp;
};
