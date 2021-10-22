import { FC } from 'react';
import { v4 as uuid } from 'uuid';
import { RouterProps } from 'react-router';
import { Button } from 'reactstrap';
import { Result } from '../utils/Result';
import NoMenuLayout from '../common/NoMenuLayout';
import { StateFlagTimeout } from '../utils/helpers/hooks';
import { ServerForm } from './helpers/ServerForm';
import { ImportServersBtnProps } from './helpers/ImportServersBtn';
import { ServerData, ServersMap, ServerWithId } from './data';
import './CreateServer.scss';

const SHOW_IMPORT_MSG_TIME = 4000;

interface CreateServerProps extends RouterProps {
  createServer: (server: ServerWithId) => void;
  servers: ServersMap;
}

const ImportResult = ({ type }: { type: 'error' | 'success' }) => (
  <div className="mt-3">
    <Result type={type}>
      {type === 'success' && 'Servers properly imported. You can now select one from the list :)'}
      {type === 'error' && 'The servers could not be imported. Make sure the format is correct.'}
    </Result>
  </div>
);

const CreateServer = (ImportServersBtn: FC<ImportServersBtnProps>, useStateFlagTimeout: StateFlagTimeout) => (
  { servers, createServer, history: { push, goBack } }: CreateServerProps,
) => {
  const hasServers = !!Object.keys(servers).length;
  const [ serversImported, setServersImported ] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);
  const [ errorImporting, setErrorImporting ] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);
  const handleSubmit = (serverData: ServerData) => {
    const id = uuid();

    createServer({ ...serverData, id });
    push(`/server/${id}`);
  };

  return (
    <NoMenuLayout>
      <ServerForm title={<h5 className="mb-0">Add new server</h5>} onSubmit={handleSubmit}>
        {!hasServers &&
          <ImportServersBtn tooltipPlacement="top" onImport={setServersImported} onImportError={setErrorImporting} />}
        {hasServers && <Button outline onClick={goBack}>Cancel</Button>}
        <Button outline color="primary" className="ml-2">Create server</Button>
      </ServerForm>

      {serversImported && <ImportResult type="success" />}
      {errorImporting && <ImportResult type="error" />}
    </NoMenuLayout>
  );
};

export default CreateServer;
