import type { ResultProps, TimeoutToggle } from '@shlinkio/shlink-frontend-kit';
import { Button, Result, useToggle } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { NoMenuLayout } from '../common/NoMenuLayout';
import { withDependencies } from '../container/context';
import { useGoBack } from '../utils/helpers/hooks';
import type { ServerData } from './data';
import { ensureUniqueIds } from './helpers';
import { DuplicatedServersModal } from './helpers/DuplicatedServersModal';
import { ImportServersBtn } from './helpers/ImportServersBtn';
import { ServerForm } from './helpers/ServerForm';
import { withoutSelectedServer } from './helpers/withoutSelectedServer';
import { useServers } from './reducers/servers';

const SHOW_IMPORT_MSG_TIME = 4000;

export type CreateServerProps = {
  useTimeoutToggle: TimeoutToggle;
};

const ImportResult = ({ variant }: Pick<ResultProps, 'variant'>) => (
  <div className="mt-4">
    <Result variant={variant}>
      {variant === 'success' && 'Servers properly imported. You can now select one from the list :)'}
      {variant === 'error' && 'The servers could not be imported. Make sure the format is correct.'}
    </Result>
  </div>
);

const CreateServerBase: FC<CreateServerProps> = withoutSelectedServer(({ useTimeoutToggle }) => {
  const { servers, createServers } = useServers();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const hasServers = !!Object.keys(servers).length;
  const [serversImported, setServersImported] = useTimeoutToggle({ delay: SHOW_IMPORT_MSG_TIME });
  const [errorImporting, setErrorImporting] = useTimeoutToggle({ delay: SHOW_IMPORT_MSG_TIME });
  const { flag: isConfirmModalOpen, toggle: toggleConfirmModal } = useToggle();
  const [serverData, setServerData] = useState<ServerData>();
  const saveNewServer = useCallback(
    (newServerData: ServerData) => {
      const [newServerWithUniqueId] = ensureUniqueIds(servers, [newServerData]);

      createServers([newServerWithUniqueId]);
      navigate(`/server/${newServerWithUniqueId.id}`);
    },
    [createServers, navigate, servers],
  );
  const onSubmit = useCallback(
    (newServerData: ServerData) => {
      setServerData(newServerData);

      const serverExists = Object.values(servers).some(
        ({ url, apiKey }) => newServerData.url === url && newServerData.apiKey === apiKey,
      );

      if (serverExists) {
        toggleConfirmModal();
      } else {
        saveNewServer(newServerData);
      }
    },
    [saveNewServer, servers, toggleConfirmModal],
  );

  return (
    <NoMenuLayout>
      <ServerForm title="Add new server" onSubmit={onSubmit}>
        {!hasServers && (
          <ImportServersBtn tooltipPlacement="top" onImport={setServersImported} onError={setErrorImporting} />
        )}
        {hasServers && (
          <Button variant="secondary" onClick={goBack}>
            Cancel
          </Button>
        )}
        <Button type="submit">Create server</Button>
      </ServerForm>

      {serversImported && <ImportResult variant="success" />}
      {errorImporting && <ImportResult variant="error" />}

      <DuplicatedServersModal
        open={isConfirmModalOpen}
        duplicatedServers={serverData ? [serverData] : []}
        onClose={goBack}
        onConfirm={() => serverData && saveNewServer(serverData)}
      />
    </NoMenuLayout>
  );
});

export const CreateServer = withDependencies(CreateServerBase, ['useTimeoutToggle']);
