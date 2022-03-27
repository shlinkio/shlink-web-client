import { FC, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Result } from '../utils/Result';
import { NoMenuLayout } from '../common/NoMenuLayout';
import { StateFlagTimeout, useGoBack, useToggle } from '../utils/helpers/hooks';
import { ServerForm } from './helpers/ServerForm';
import { ImportServersBtnProps } from './helpers/ImportServersBtn';
import { ServerData, ServersMap, ServerWithId } from './data';
import { DuplicatedServersModal } from './helpers/DuplicatedServersModal';

const SHOW_IMPORT_MSG_TIME = 4000;

interface CreateServerProps {
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
  { servers, createServer }: CreateServerProps,
) => {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const hasServers = !!Object.keys(servers).length;
  const [serversImported, setServersImported] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);
  const [errorImporting, setErrorImporting] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);
  const [isConfirmModalOpen, toggleConfirmModal] = useToggle();
  const [serverData, setServerData] = useState<ServerData | undefined>();
  const save = () => {
    if (!serverData) {
      return;
    }

    const id = uuid();

    createServer({ ...serverData, id });
    navigate(`/server/${id}`);
  };

  useEffect(() => {
    const serverExists = Object.values(servers).some(
      ({ url, apiKey }) => serverData?.url === url && serverData?.apiKey === apiKey,
    );

    serverExists ? toggleConfirmModal() : save();
  }, [serverData]);

  return (
    <NoMenuLayout>
      <ServerForm title={<h5 className="mb-0">Add new server</h5>} onSubmit={setServerData}>
        {!hasServers && (
          <ImportServersBtn tooltipPlacement="top" onImport={setServersImported} onImportError={setErrorImporting} />
        )}
        {hasServers && <Button outline onClick={goBack}>Cancel</Button>}
        <Button outline color="primary" className="ms-2">Create server</Button>
      </ServerForm>

      {serversImported && <ImportResult type="success" />}
      {errorImporting && <ImportResult type="error" />}

      <DuplicatedServersModal
        isOpen={isConfirmModalOpen}
        duplicatedServers={serverData ? [serverData] : []}
        onDiscard={goBack}
        onSave={save}
      />
    </NoMenuLayout>
  );
};

export default CreateServer;
