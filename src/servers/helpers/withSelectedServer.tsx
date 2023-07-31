import type { FC } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Message } from '../../../shlink-frontend-kit/src';
import { NoMenuLayout } from '../../common/NoMenuLayout';
import type { SelectedServer } from '../data';
import { isNotFoundServer } from '../data';

interface WithSelectedServerProps {
  selectServer: (serverId: string) => void;
  selectedServer: SelectedServer;
}

export function withSelectedServer<T = {}>(WrappedComponent: FC<WithSelectedServerProps & T>, ServerError: FC) {
  return (props: WithSelectedServerProps & T) => {
    const params = useParams<{ serverId: string }>();
    const { selectServer, selectedServer } = props;

    useEffect(() => {
      params.serverId && selectServer(params.serverId);
    }, [params.serverId]);

    if (!selectedServer) {
      return (
        <NoMenuLayout>
          <Message loading />
        </NoMenuLayout>
      );
    }

    if (isNotFoundServer(selectedServer)) {
      return <ServerError />;
    }

    return <WrappedComponent {...props} />;
  };
}
