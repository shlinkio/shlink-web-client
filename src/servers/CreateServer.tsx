import React, { FC, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { RouterProps } from 'react-router';
import NoMenuLayout from '../common/NoMenuLayout';
import { ServerForm } from './helpers/ServerForm';
import { ImportServersBtnProps } from './helpers/ImportServersBtn';
import { NewServerData, RegularServer } from './data';
import './CreateServer.scss';

const SHOW_IMPORT_MSG_TIME = 4000;

interface CreateServerProps extends RouterProps {
  createServer: (server: RegularServer) => void;
  resetSelectedServer: Function;
}

const CreateServer = (ImportServersBtn: FC<ImportServersBtnProps>, useStateFlagTimeout: Function) => (
  { createServer, history: { push }, resetSelectedServer }: CreateServerProps,
) => {
  const [ serversImported, setServersImported ] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);
  const handleSubmit = (serverData: NewServerData) => {
    const id = uuid();

    createServer({ ...serverData, id });
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

export default CreateServer;
