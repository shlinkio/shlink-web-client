import React, { FC, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import Message from '../../utils/Message';
import { isNotFoundServer, SelectedServer } from '../data';

interface WithSelectedServerProps extends RouteComponentProps<{ serverId: string }> {
  selectServer: (serverId: string) => void;
  selectedServer: SelectedServer;
}

export function withSelectedServer<T = {}>(WrappedComponent: FC<WithSelectedServerProps & T>, ServerError: FC) {
  return (props: WithSelectedServerProps & T) => {
    const { selectServer, selectedServer, match } = props;

    useEffect(() => {
      selectServer(match.params.serverId);
    }, [ match.params.serverId ]);

    if (!selectedServer) {
      return <Message loading />;
    }

    if (isNotFoundServer(selectedServer)) {
      return <ServerError />;
    }

    return <WrappedComponent {...props} />;
  };
}
