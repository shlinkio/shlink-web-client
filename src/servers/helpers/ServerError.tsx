import { Message } from '@shlinkio/shlink-frontend-kit';
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
        <Message className="w-100 mb-3 mb-md-5" type="error" fullWidth>
          {!isServerWithId(selectedServer) && 'Could not find this Shlink server.'}
          {isServerWithId(selectedServer) && (
            <>
              <p>Oops! Could not connect to this Shlink server.</p>
              Make sure you have internet connection, and the server is properly configured and on-line.
            </>
          )}
        </Message>

        <ServersListGroup servers={Object.values(servers)}>
          <p className="mb-md-3">
            These are the Shlink servers currently configured. Choose one of
            them or <Link to="/server/create">add a new one</Link>.
          </p>
        </ServersListGroup>

        {isServerWithId(selectedServer) && (
          <div className="container mt-3 mt-md-5">
            <p className="fs-5 fw-normal lh-sm">
              Alternatively, if you think you may have miss-configured this server, you
              can <DeleteServerButton server={selectedServer} className="server-error__delete-btn">remove it</DeleteServerButton> or&nbsp;
              <Link to={`/server/${selectedServer.id}/edit?reconnect=true`}>edit it</Link>.
            </p>
          </div>
        )}
      </div>
    </NoMenuLayout>
  );
};

export const ServerErrorFactory = componentFactory(ServerError, ['DeleteServerButton']);
