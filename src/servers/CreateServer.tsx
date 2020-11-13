import { FC } from 'react';
import { v4 as uuid } from 'uuid';
import { RouterProps } from 'react-router';
import classNames from 'classnames';
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

const Result: FC<{ type: 'success' | 'error' }> = ({ children, type }) => (
  <div className="row">
    <div className="col-md-10 offset-md-1">
      <div
        className={classNames('p-2 mt-3 text-white text-center', {
          'bg-main': type === 'success',
          'bg-danger': type === 'error',
        })}
      >
        {children}
      </div>
    </div>
  </div>
);

const CreateServer = (ImportServersBtn: FC<ImportServersBtnProps>, useStateFlagTimeout: StateFlagTimeout) => (
  { createServer, history: { push } }: CreateServerProps,
) => {
  const [ serversImported, setServersImported ] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);
  const [ errorImporting, setErrorImporting ] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);
  const handleSubmit = (serverData: ServerData) => {
    const id = uuid();

    createServer({ ...serverData, id });
    push(`/server/${id}/list-short-urls/1`);
  };

  return (
    <NoMenuLayout>
      <ServerForm onSubmit={handleSubmit}>
        <ImportServersBtn onImport={setServersImported} onImportError={setErrorImporting} />
        <button className="btn btn-outline-primary">Create server</button>
      </ServerForm>

      {serversImported && <Result type="success">Servers properly imported. You can now select one from the list :)</Result>}
      {errorImporting && <Result type="error">The servers could not be imported. Make sure the format is correct.</Result>}
    </NoMenuLayout>
  );
};

export default CreateServer;
