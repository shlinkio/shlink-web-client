import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import NoMenuLayout from '../common/NoMenuLayout';
import { ServerForm } from './helpers/ServerForm';
import './CreateServer.scss';

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
      <NoMenuLayout>
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
      </NoMenuLayout>
    );
  };

  CreateServerComp.propTypes = propTypes;

  return CreateServerComp;
};

export default CreateServer;
