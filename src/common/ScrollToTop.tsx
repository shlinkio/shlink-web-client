import { FC, PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = (): FC<PropsWithChildren<unknown>> => ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};

export default ScrollToTop;
