import { FC } from 'react';
import { Button } from 'reactstrap';
import NoMenuLayout from '../common/NoMenuLayout';
import { ServerForm } from './helpers/ServerForm';
import { withSelectedServer } from './helpers/withSelectedServer';
import { isServerWithId, ServerData } from './data';

interface EditServerProps {
  editServer: (serverId: string, serverData: ServerData) => void;
}

export const EditServer = (ServerError: FC) => withSelectedServer<EditServerProps>((
  { editServer, selectedServer, history: { push, goBack } },
) => {
  if (!isServerWithId(selectedServer)) {
    return null;
  }

  const handleSubmit = (serverData: ServerData) => {
    editServer(selectedServer.id, serverData);
    push(`/server/${selectedServer.id}/list-short-urls/1`);
  };

  return (
    <NoMenuLayout>
      <ServerForm initialValues={selectedServer} onSubmit={handleSubmit}>
        <Button outline className="mr-2" onClick={goBack}>Cancel</Button>
        <Button outline color="primary">Save</Button>
      </ServerForm>
    </NoMenuLayout>
  );
}, ServerError);
