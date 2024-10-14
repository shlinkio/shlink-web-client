import type { TimeoutToggle } from '@shlinkio/shlink-frontend-kit';
import { Result, useToggle } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { NoMenuLayout } from '../common/NoMenuLayout';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import { useGoBack } from '../utils/helpers/hooks';
import { randomUUID } from '../utils/utils';
import type { ServerData, ServersMap, ServerWithId } from './data';
import { DuplicatedServersModal } from './helpers/DuplicatedServersModal';
import type { ImportServersBtnProps } from './helpers/ImportServersBtn';
import { ServerForm } from './helpers/ServerForm';

const SHOW_IMPORT_MSG_TIME = 4000;

type CreateServerProps = {
  createServers: (servers: ServerWithId[]) => void;
  servers: ServersMap;
};

type CreateServerDeps = {
  ImportServersBtn: FC<ImportServersBtnProps>;
  useTimeoutToggle: TimeoutToggle;
};

const ImportResult = ({ type }: { type: 'error' | 'success' }) => (
  <div className="mt-3">
    <Result type={type}>
      {type === 'success' && 'Servers properly imported. You can now select one from the list :)'}
      {type === 'error' && 'The servers could not be imported. Make sure the format is correct.'}
    </Result>
  </div>
);

const CreateServer: FCWithDeps<CreateServerProps, CreateServerDeps> = ({ servers, createServers }) => {
  const { ImportServersBtn, useTimeoutToggle } = useDependencies(CreateServer);
  const navigate = useNavigate();
  const goBack = useGoBack();
  const hasServers = !!Object.keys(servers).length;
  const [serversImported, setServersImported] = useTimeoutToggle(false, SHOW_IMPORT_MSG_TIME);
  const [errorImporting, setErrorImporting] = useTimeoutToggle(false, SHOW_IMPORT_MSG_TIME);
  const [isConfirmModalOpen, toggleConfirmModal] = useToggle();
  const [serverData, setServerData] = useState<ServerData>();
  const saveNewServer = useCallback((theServerData: ServerData) => {
    const id = randomUUID();

    createServers([{ ...theServerData, id }]);
    navigate(`/server/${id}`);
  }, [createServers, navigate]);
  const onSubmit = useCallback((newServerData: ServerData) => {
    setServerData(newServerData);

    const serverExists = Object.values(servers).some(
      ({ url, apiKey }) => newServerData.url === url && newServerData.apiKey === apiKey,
    );

    if (serverExists) {
      toggleConfirmModal();
    } else {
      saveNewServer(newServerData);
    }
  }, [saveNewServer, servers, toggleConfirmModal]);

  return (
    <NoMenuLayout>
      <ServerForm title={<h5 className="mb-0">Add new server</h5>} onSubmit={onSubmit}>
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
        onSave={() => serverData && saveNewServer(serverData)}
      />
    </NoMenuLayout>
  );
};

export const CreateServerFactory = componentFactory(CreateServer, ['ImportServersBtn', 'useTimeoutToggle']);
