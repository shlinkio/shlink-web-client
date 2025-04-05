import { Card, Message } from '@shlinkio/shlink-frontend-kit/tailwind';
import type { FC } from 'react';
import { Link } from 'react-router';
import { NoMenuLayout } from '../../common/NoMenuLayout';
import type { FCWithDeps } from '../../container/utils';
import { componentFactory, useDependencies } from '../../container/utils';
import type { SelectedServer, ServersMap } from '../data';
import { isServerWithId } from '../data';
import type { DeleteServerButtonProps } from '../DeleteServerButton';
import { ServersListGroup } from '../ServersListGroup';

type ServerErrorProps = {
  servers: ServersMap;
  selectedServer: SelectedServer;
};

type ServerErrorDeps = {
  DeleteServerButton: FC<DeleteServerButtonProps>;
};

const ServerError: FCWithDeps<ServerErrorProps, ServerErrorDeps> = ({ servers, selectedServer }) => {
  const { DeleteServerButton } = useDependencies(ServerError);

  return (
    <NoMenuLayout>
      <div className="tw:flex tw:flex-col tw:items-center tw:gap-y-4 tw:md:gap-y-8">
        <Message className="tw:w-full tw:lg:w-[80%]" variant="error">
          {!isServerWithId(selectedServer) && 'Could not find this Shlink server.'}
          {isServerWithId(selectedServer) && (
            <>
              <p>Oops! Could not connect to this Shlink server.</p>
              Make sure you have internet connection, and the server is properly configured and on-line.
            </>
          )}
        </Message>

        <p className="tw:text-xl">
          These are the Shlink servers currently configured. Choose one of
          them or <Link to="/server/create">add a new one</Link>.
        </p>
        <Card className="tw:w-full tw:max-w-100 tw:overflow-hidden">
          <ServersListGroup borderless servers={Object.values(servers)} />
        </Card>

        {isServerWithId(selectedServer) && (
          <p className="tw:text-xl">
            Alternatively, if you think you may have misconfigured this server, you
            can <DeleteServerButton server={selectedServer}>remove
              it</DeleteServerButton> or&nbsp;
            <Link to={`/server/${selectedServer.id}/edit?reconnect=true`}>edit it</Link>.
          </p>
        )}
      </div>
    </NoMenuLayout>
  );
};

export const ServerErrorFactory = componentFactory(ServerError, ['DeleteServerButton']);
