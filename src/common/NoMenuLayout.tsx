import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';

export type NoMenuLayoutProps = PropsWithChildren & {
  className?: string;
};

export const NoMenuLayout: FC<NoMenuLayoutProps> = ({ children, className }) => (
  <div className={clsx('tw:container tw:mx-auto tw:p-5 tw:pt-8 tw:max-md:p-0 tw:max-md:py-4', className)}>
    {children}
  </div>
);
