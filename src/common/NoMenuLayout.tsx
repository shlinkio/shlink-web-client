import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';

export type NoMenuLayoutProps = PropsWithChildren & {
  className?: string;
};

export const NoMenuLayout: FC<NoMenuLayoutProps> = ({ children, className }) => (
  <div className={clsx('container mx-auto p-5 pt-8 max-md:p-3 max-md:py-4', className)}>
    {children}
  </div>
);
