import React, { useState, useEffect } from 'react';
import PropTypes, { serverType } from 'prop-types';
import { HorizontalFormGroup } from '../utils/HorizontalFormGroup';
import './CreateServer.scss';
import Message from '../utils/Message';

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
    const [ name, setName ] = useState('');
    const [ url, setUrl ] = useState('');
    const [ apiKey, setApiKey ] = useState('');
    const { params: { serverId } } = match;
    const handleSubmit = (e) => {
      e.preventDefault();

      editServer(serverId, { name, url, apiKey });
      push(`/server/${serverId}/list-short-urls/1`);
    };

    useEffect(() => {
      selectServer(serverId);
    }, [ serverId ]);
    useEffect(() => {
      selectedServer && setName(selectedServer.name);
      selectedServer && setUrl(selectedServer.url);
      selectedServer && setApiKey(selectedServer.apiKey);
    }, [ selectedServer ]);

    if (!selectedServer) {
      return <Message loading />;
    }

    if (selectedServer.serverNotFound) {
      return <ServerError type="not-found" />;
    }

    return (
      <div className="create-server">
        <form onSubmit={handleSubmit}>
          <HorizontalFormGroup value={name} onChange={setName}>Name</HorizontalFormGroup>
          <HorizontalFormGroup type="url" value={url} onChange={setUrl}>URL</HorizontalFormGroup>
          <HorizontalFormGroup value={apiKey} onChange={setApiKey}>API key</HorizontalFormGroup>

          <div className="text-right">
            <button className="btn btn-outline-primary">Save</button>
          </div>
        </form>
      </div>
    );
  };

  EditServerComp.propTypes = propTypes;

  return EditServerComp;
};
