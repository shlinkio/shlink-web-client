import { Button, SimpleCard } from '@shlinkio/shlink-frontend-kit/tailwind';
import type { FC, PropsWithChildren } from 'react';

type NotFoundProps = PropsWithChildren<{ to?: string }>;

export const NotFound: FC<NotFoundProps> = ({ to = '/', children = 'Home' }) => (
  <div className="tw:pt-4">
    <SimpleCard className="tw:p-4 tw:w-full tw:lg:w-[50%] tw:m-auto">
      <h2>Oops! We could not find requested route.</h2>
      <p>
        Use your browser&apos;s back button to navigate to the page you have previously come from, or just press this
        button.
      </p>
      <br />
      <Button inline to={to} size="lg">{children}</Button>
    </SimpleCard>
  </div>
);
