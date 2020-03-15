import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import './CreateServer.scss';
import { ServerForm } from './helpers/ServerForm';

const SHOW_IMPORT_MSG_TIME = 4000;
const propTypes = {
  createServer: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  resetSelectedServer: PropTypes.func,
};

const CreateServer = (ImportServersBtn, useStateFlagTimeout) => {
  const CreateServerComp = ({ createServer, history: { push }, resetSelectedServer }) => {
    const [ serversImported, setServersImported ] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);
    const handleSubmit = (serverData) => {
      const id = uuid();
      const server = { id, ...serverData };

      createServer(server);
      push(`/server/${id}/list-short-urls/1`);
    };

    useEffect(() => {
      resetSelectedServer();
    }, []);

    return (
      <div className="create-server">
        <ServerForm onSubmit={handleSubmit}>
          <ImportServersBtn onImport={setServersImported} />
          <button className="btn btn-outline-primary">Create server</button>
        </ServerForm>

        {serversImported && (
          <div className="row create-server__import-success-msg">
            <div className="col-md-10 offset-md-1">
              <div className="p-2 mt-3 bg-main text-white text-center">
                Servers properly imported. You can now select one from the list :)
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  CreateServerComp.propTypes = propTypes;

  return CreateServerComp;
};

export default CreateServer;
