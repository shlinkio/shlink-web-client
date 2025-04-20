import { useParsedQuery } from '@shlinkio/shlink-frontend-kit';
import { Button } from '@shlinkio/shlink-frontend-kit/tailwind';
import type { FC } from 'react';
import { NoMenuLayout } from '../common/NoMenuLayout';
import type { FCWithDeps } from '../container/utils';
import { componentFactory } from '../container/utils';
import { useGoBack } from '../utils/helpers/hooks';
import type { ServerData } from './data';
import { isServerWithId } from './data';
import { ServerForm } from './helpers/ServerForm';
import type { WithSelectedServerProps } from './helpers/withSelectedServer';
import { withSelectedServer } from './helpers/withSelectedServer';

type EditServerProps = WithSelectedServerProps & {
  editServer: (serverId: string, serverData: ServerData) => void;
};

type EditServerDeps = {
  ServerError: FC;
};

const EditServer: FCWithDeps<EditServerProps, EditServerDeps> = withSelectedServer((
  { editServer, selectedServer, selectServer },
) => {
  const goBack = useGoBack();
  const { reconnect } = useParsedQuery<{ reconnect?: 'true' }>();

  if (!isServerWithId(selectedServer)) {
    return null;
  }

  const handleSubmit = (serverData: ServerData) => {
    editServer(selectedServer.id, serverData);
    if (reconnect === 'true') {
      selectServer(selectedServer.id);
    }
    goBack();
  };

  return (
    <NoMenuLayout>
      <ServerForm
        title={<>Edit &quot;{selectedServer.name}&quot;</>}
        initialValues={selectedServer}
        onSubmit={handleSubmit}
      >
        <Button variant="secondary" onClick={goBack}>Cancel</Button>
        <Button type="submit">Save</Button>
      </ServerForm>
    </NoMenuLayout>
  );
});

export const EditServerFactory = componentFactory(EditServer, ['ServerError']);
