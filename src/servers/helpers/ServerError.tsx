import { Card, Message } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { Link } from 'react-router';
import { NoMenuLayout } from '../../common/NoMenuLayout';
import { isServerWithId } from '../data';
import { DeleteServerButton } from '../DeleteServerButton';
import { useSelectedServer } from '../reducers/selectedServer';
import { useServers } from '../reducers/servers';
import { ServersListGroup } from '../ServersListGroup';

export const ServerError: FC = () => {
  const { servers } = useServers();
  const { selectedServer } = useSelectedServer();

  return (
    <NoMenuLayout>
      <div className="flex flex-col items-center gap-y-4 md:gap-y-8">
        <Message className="w-full lg:w-[80%]" variant="error">
          {!isServerWithId(selectedServer) && 'Could not find this Shlink server.'}
          {isServerWithId(selectedServer) && (
            <>
              <p>Oops! Could not connect to this Shlink server.</p>
              Make sure you have internet connection, and the server is properly configured and on-line.
            </>
          )}
        </Message>

        <p className="text-xl">
          These are the Shlink servers currently configured. Choose one of them or{' '}
          <Link to="/server/create">add a new one</Link>.
        </p>
        <Card className="w-full max-w-100 overflow-hidden">
          <ServersListGroup borderless servers={Object.values(servers)} />
        </Card>

        {isServerWithId(selectedServer) && (
          <p className="text-xl">
            Alternatively, if you think you may have misconfigured this server, you can{' '}
            <DeleteServerButton server={selectedServer}>remove it</DeleteServerButton> or&nbsp;
            <Link to={`/server/${selectedServer.id}/edit?reconnect=true`}>edit it</Link>.
          </p>
        )}
      </div>
    </NoMenuLayout>
  );
};
