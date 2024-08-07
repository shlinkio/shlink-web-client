import { Message } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NoMenuLayout } from '../../common/NoMenuLayout';
import type { FCWithDeps } from '../../container/utils';
import { useDependencies } from '../../container/utils';
import type { SelectedServer } from '../data';
import { isNotFoundServer } from '../data';

export type WithSelectedServerProps = {
  selectServer: (serverId: string) => void;
  selectedServer: SelectedServer;
};

type WithSelectedServerPropsDeps = {
  ServerError: FC;
};

export function withSelectedServer<T extends object>(
  WrappedComponent: FCWithDeps<WithSelectedServerProps & T, WithSelectedServerPropsDeps>,
) {
  const ComponentWrapper: FCWithDeps<WithSelectedServerProps & T, WithSelectedServerPropsDeps> = (props) => {
    const { ServerError } = useDependencies(ComponentWrapper);
    const params = useParams<{ serverId: string }>();
    const { selectServer, selectedServer } = props;

    useEffect(() => {
      if (params.serverId) {
        selectServer(params.serverId);
      }
    }, [params.serverId, selectServer]);

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
  return ComponentWrapper;
}
