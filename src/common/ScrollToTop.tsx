import React, { PropsWithChildren, useEffect } from 'react';
import { RouteChildrenProps } from 'react-router';

const ScrollToTop = () => ({ location, children }: PropsWithChildren<RouteChildrenProps>) => {
  useEffect(() => {
    scrollTo(0, 0);
  }, [ location ]);

  return <React.Fragment>{children}</React.Fragment>;
};

export default ScrollToTop;
