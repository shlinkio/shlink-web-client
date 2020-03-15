import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import { HorizontalFormGroup } from '../utils/HorizontalFormGroup';
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
    const [ name, setName ] = useState('');
    const [ url, setUrl ] = useState('');
    const [ apiKey, setApiKey ] = useState('');
    const [ serversImported, setServersImported ] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);
    const handleSubmit = (e) => {
      e.preventDefault();

      const id = uuid();
      const server = { id, name, url, apiKey };

      createServer(server);
      push(`/server/${id}/list-short-urls/1`);
    };

    useEffect(() => {
      resetSelectedServer();
    }, []);

    return (
      <div className="create-server">
        <form onSubmit={handleSubmit}>
          <HorizontalFormGroup value={name} onChange={setName}>Name</HorizontalFormGroup>
          <HorizontalFormGroup type="url" value={url} onChange={setUrl}>URL</HorizontalFormGroup>
          <HorizontalFormGroup value={apiKey} onChange={setApiKey}>API key</HorizontalFormGroup>

          <div className="text-right">
            <ImportServersBtn onImport={setServersImported} />
            <button className="btn btn-outline-primary">Create server</button>
          </div>

          {serversImported && (
            <div className="row create-server__import-success-msg">
              <div className="col-md-10 offset-md-1">
                <div className="p-2 mt-3 bg-main text-white text-center">
                  Servers properly imported. You can now select one from the list :)
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    );
  };

  CreateServerComp.propTypes = propTypes;

  return CreateServerComp;
};

export default CreateServer;
