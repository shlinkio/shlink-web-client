import React from 'react';
import PropTypes from 'prop-types';
import { ServerForm } from './helpers/ServerForm';
import { withSelectedServer } from './helpers/withSelectedServer';
import { serverType } from './prop-types';

const propTypes = {
  editServer: PropTypes.func,
  selectedServer: serverType,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export const EditServer = (ServerError) => {
  const EditServerComp = ({ editServer, selectedServer, history: { push } }) => {
    const handleSubmit = (serverData) => {
      editServer(selectedServer.id, serverData);
      push(`/server/${selectedServer.id}/list-short-urls/1`);
    };

    return (
      <div className="create-server">
        <ServerForm initialValues={selectedServer} onSubmit={handleSubmit}>
          <button className="btn btn-outline-primary">Save</button>
        </ServerForm>
      </div>
    );
  };

  EditServerComp.propTypes = propTypes;

  return withSelectedServer(EditServerComp, ServerError);
};
