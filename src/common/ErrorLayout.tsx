import { SimpleCard } from '@shlinkio/shlink-frontend-kit';
import type { FC, PropsWithChildren } from 'react';

export type ErrorLayoutProps = PropsWithChildren<{
  title: string;
}>;

export const ErrorLayout: FC<ErrorLayoutProps> = ({ children, title }) => (
  <div className="pt-4">
    <SimpleCard className="p-4 w-full lg:w-[65%] m-auto">
      <h2>{title}</h2>
      {children}
    </SimpleCard>
  </div>
);
