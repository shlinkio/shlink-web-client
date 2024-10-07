import type { FC } from 'react';
import { useEffect } from 'react';

interface WithoutSelectedServerProps {
  resetSelectedServer: () => unknown;
}

export function withoutSelectedServer<T extends object>(WrappedComponent: FC<WithoutSelectedServerProps & T>) {
  return (props: WithoutSelectedServerProps & T) => {
    const { resetSelectedServer } = props;
    useEffect(() => {
      resetSelectedServer();
    }, [resetSelectedServer]);

    return <WrappedComponent {...props} />;
  };
}
