import { SimpleCard } from '@shlinkio/shlink-frontend-kit/tailwind';
import type { FC, PropsWithChildren } from 'react';

export type ErrorLayoutProps = PropsWithChildren<{
  title: string;
}>;

export const ErrorLayout: FC<ErrorLayoutProps> = ({ children, title }) => (
  <div className="tw:pt-4">
    <SimpleCard className="tw:p-4 tw:w-full tw:lg:w-[65%] tw:m-auto">
      <h2>{title}</h2>
      {children}
    </SimpleCard>
  </div>
);
