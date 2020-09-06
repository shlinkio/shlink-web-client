import React, { PropsWithChildren, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

const ScrollToTop = () => ({ location, children }: PropsWithChildren<RouteComponentProps>) => {
  useEffect(() => {
    scrollTo(0, 0);
  }, [ location ]);

  return <React.Fragment>{children}</React.Fragment>;
};

export default ScrollToTop;
