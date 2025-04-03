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
import './ServerError.scss';

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
      <div className="server-error__container flex-column">
        <Message className="w-100 mb-3 mb-md-5" variant="error">
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
        <Card className="tw:w-full tw:max-w-100 tw:overflow-hidden tw:mt-4">
          <ServersListGroup borderless servers={Object.values(servers)} />
        </Card>

        {isServerWithId(selectedServer) && (
          <div className="container mt-3 mt-md-5">
            <p className="tw:text-xl">
              Alternatively, if you think you may have misconfigured this server, you
              can <DeleteServerButton server={selectedServer} className="server-error__delete-btn">remove
                it</DeleteServerButton> or&nbsp;
              <Link to={`/server/${selectedServer.id}/edit?reconnect=true`}>edit it</Link>.
            </p>
          </div>
        )}
      </div>
    </NoMenuLayout>
  );
};

export const ServerErrorFactory = componentFactory(ServerError, ['DeleteServerButton']);
