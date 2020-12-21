import { FC } from 'react';
import { v4 as uuid } from 'uuid';
import { RouterProps } from 'react-router';
import { Result } from '../utils/Result';
import NoMenuLayout from '../common/NoMenuLayout';
import { StateFlagTimeout } from '../utils/helpers/hooks';
import { ServerForm } from './helpers/ServerForm';
import { ImportServersBtnProps } from './helpers/ImportServersBtn';
import { ServerData, ServerWithId } from './data';
import './CreateServer.scss';

const SHOW_IMPORT_MSG_TIME = 4000;

interface CreateServerProps extends RouterProps {
  createServer: (server: ServerWithId) => void;
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
    const id = uuid();

    createServer({ ...serverData, id });
    push(`/server/${id}`);
  };

  return (
    <NoMenuLayout>
      <ServerForm title={<h5 className="mb-0">Add new server</h5>} onSubmit={handleSubmit}>
        <ImportServersBtn onImport={setServersImported} onImportError={setErrorImporting} />
        <button className="btn btn-outline-primary">Create server</button>
      </ServerForm>

      {(serversImported || errorImporting) && (
        <div className="mt-4">
          {serversImported && <ImportResult type="success" />}
          {errorImporting && <ImportResult type="error" />}
        </div>
      )}
    </NoMenuLayout>
  );
};

export default CreateServer;
