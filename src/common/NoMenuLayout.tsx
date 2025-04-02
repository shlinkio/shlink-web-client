import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import './NoMenuLayout.scss';

export type NoMenuLayoutProps = PropsWithChildren & {
  className?: string;
};

export const NoMenuLayout: FC<NoMenuLayoutProps> = ({ children, className }) => (
  <div className={clsx('no-menu-wrapper tw:container tw:mx-auto', className)}>{children}</div>
);
