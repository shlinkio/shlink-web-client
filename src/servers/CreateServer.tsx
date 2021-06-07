import { FC } from 'react';
import { RouterProps } from 'react-router';
import { Result } from '../utils/Result';
import NoMenuLayout from '../common/NoMenuLayout';
import { StateFlagTimeout } from '../utils/helpers/hooks';
import { ServerForm } from './helpers/ServerForm';
import { ImportServersBtnProps } from './helpers/ImportServersBtn';
import { ServerData, ServersMap } from './data';
import './CreateServer.scss';

const SHOW_IMPORT_MSG_TIME = 4000;

interface CreateServerProps extends RouterProps {
  createServer: (server: ServerData) => { type: string, newServers: ServersMap};
}

const ImportResult = ({ type }: { type: 'error' | 'success' }) => (
  <Result type={type}>
    {type === 'success' && 'Servers properly imported. You can now select one from the list :)'}
    {type === 'error' && 'The servers could not be imported. Make sure the format is correct.'}
  </Result>
);

const CreateServer = (ImportServersBtn: FC<ImportServersBtnProps>, useStateFlagTimeout: StateFlagTimeout) => (
  { createServer, history: { push } }: CreateServerProps,
) => {
  const [ serversImported, setServersImported ] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);
  const [ errorImporting, setErrorImporting ] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);
  const handleSubmit = (serverData: ServerData) => {
    const { newServers } = createServer({ ...serverData });

    const newServer = Object.values(newServers)[0];
    
    push(`/server/${newServer.id}`);
  };

  return (
    <NoMenuLayout>
      <ServerForm title={<h5 className="mb-0">Add new server</h5>} onSubmit={handleSubmit}>
        <ImportServersBtn onImport={setServersImported} onImportError={setErrorImporting} />
        <button className="btn btn-outline-primary">Create server</button>
      </ServerForm>

      {(serversImported || errorImporting) && (
        <div className="mt-3">
          {serversImported && <ImportResult type="success" />}
          {errorImporting && <ImportResult type="error" />}
        </div>
      )}
    </NoMenuLayout>
  );
};

export default CreateServer;
