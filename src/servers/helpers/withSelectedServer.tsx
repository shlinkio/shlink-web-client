import React, { FC, useEffect } from 'react';
import { RouteChildrenProps } from 'react-router';
import Message from '../../utils/Message';
import { isNotFoundServer, SelectedServer } from '../data';

interface WithSelectedServerProps extends RouteChildrenProps<{ serverId: string }> {
  selectServer: (serverId: string) => void;
  selectedServer: SelectedServer;
}

export const withSelectedServer = (WrappedComponent: FC<WithSelectedServerProps>, ServerError: FC) => (
  props: WithSelectedServerProps,
) => {
  const { selectServer, selectedServer, match } = props;

  useEffect(() => {
    match?.params?.serverId && selectServer(match?.params.serverId);
  }, [ match?.params.serverId ]);

  if (!selectedServer) {
    return <Message loading />;
  }

  if (isNotFoundServer(selectedServer)) {
    return <ServerError />;
  }

  return <WrappedComponent {...props} />;
};
