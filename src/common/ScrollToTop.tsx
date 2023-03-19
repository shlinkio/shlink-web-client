import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};
