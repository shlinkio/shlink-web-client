import { FC, useEffect } from 'react';

interface WithoutSelectedServerProps {
  resetSelectedServer: Function;
}

export function withoutSelectedServer<T = {}>(WrappedComponent: FC<WithoutSelectedServerProps & T>) {
  return (props: WithoutSelectedServerProps & T) => {
    const { resetSelectedServer } = props;
    useEffect(() => {
      resetSelectedServer();
    }, []);

    return <WrappedComponent {...props} />;
  };
}
