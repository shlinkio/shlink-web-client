import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { v4 as uuid } from 'uuid';
import { NoMenuLayout } from '../common/NoMenuLayout';
import type { TimeoutToggle } from '../utils/helpers/hooks';
import { useGoBack, useToggle } from '../utils/helpers/hooks';
import { Result } from '../utils/Result';
import type { ServerData, ServersMap, ServerWithId } from './data';
import { DuplicatedServersModal } from './helpers/DuplicatedServersModal';
import type { ImportServersBtnProps } from './helpers/ImportServersBtn';
import { ServerForm } from './helpers/ServerForm';

const SHOW_IMPORT_MSG_TIME = 4000;

interface CreateServerProps {
  createServers: (servers: ServerWithId[]) => void;
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

export const CreateServer = (ImportServersBtn: FC<ImportServersBtnProps>, useTimeoutToggle: TimeoutToggle) => (
  { servers, createServers }: CreateServerProps,
) => {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const hasServers = !!Object.keys(servers).length;
  const [serversImported, setServersImported] = useTimeoutToggle(false, SHOW_IMPORT_MSG_TIME);
  const [errorImporting, setErrorImporting] = useTimeoutToggle(false, SHOW_IMPORT_MSG_TIME);
  const [isConfirmModalOpen, toggleConfirmModal] = useToggle();
  const [serverData, setServerData] = useState<ServerData | undefined>();
  const save = () => {
    if (!serverData) {
      return;
    }

    const id = uuid();

    createServers([{ ...serverData, id }]);
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
