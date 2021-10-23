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
  { editServer, selectedServer, history: { goBack } },
) => {
  if (!isServerWithId(selectedServer)) {
    return null;
  }

  const handleSubmit = (serverData: ServerData) => {
    editServer(selectedServer.id, serverData);
    goBack();
  };

  return (
    <NoMenuLayout>
      <ServerForm
        title={<h5 className="mb-0">Edit &quot;{selectedServer.name}&quot;</h5>}
        initialValues={selectedServer}
        onSubmit={handleSubmit}
      >
        <Button outline className="mr-2" onClick={goBack}>Cancel</Button>
        <Button outline color="primary">Save</Button>
      </ServerForm>
    </NoMenuLayout>
  );
}, ServerError);
