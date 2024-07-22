import { useParsedQuery } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { Button } from 'reactstrap';
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
    reconnect === 'true' && selectServer(selectedServer.id);
    goBack();
  };

  return (
    <NoMenuLayout>
      <ServerForm
        title={<h5 className="mb-0">Edit &quot;{selectedServer.name}&quot;</h5>}
        initialValues={selectedServer}
        onSubmit={handleSubmit}
      >
        <Button outline className="me-2" onClick={goBack}>Cancel</Button>
        <Button outline color="primary">Save</Button>
      </ServerForm>
    </NoMenuLayout>
  );
});

export const EditServerFactory = componentFactory(EditServer, ['ServerError']);
