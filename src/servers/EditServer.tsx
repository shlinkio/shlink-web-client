import type { FC } from 'react';
import { Button } from 'reactstrap';
import { NoMenuLayout } from '../common/NoMenuLayout';
import { useGoBack, useParsedQuery } from '../utils/helpers/hooks';
import type { ServerData } from './data';
import { isServerWithId } from './data';
import { ServerForm } from './helpers/ServerForm';
import { withSelectedServer } from './helpers/withSelectedServer';

interface EditServerProps {
  editServer: (serverId: string, serverData: ServerData) => void;
}

export const EditServer = (ServerError: FC) => withSelectedServer<EditServerProps>((
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
}, ServerError);
