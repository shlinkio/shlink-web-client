import type { FC, PropsWithChildren } from 'react';
import './NoMenuLayout.scss';

export const NoMenuLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="no-menu-wrapper container-xl">{children}</div>
);
