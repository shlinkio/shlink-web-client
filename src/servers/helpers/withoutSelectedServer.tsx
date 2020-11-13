import { FC, useEffect } from 'react';

interface WithoutSelectedServerProps {
  resetSelectedServer: Function;
}

export function withoutSelectedServer<T = {}>(WrappedComponent: FC<WithoutSelectedServerProps & T>) {
  return (props: WithoutSelectedServerProps & T) => {
    useEffect(() => {
      props.resetSelectedServer();
    }, []);

    return <WrappedComponent {...props} />;
  };
}
