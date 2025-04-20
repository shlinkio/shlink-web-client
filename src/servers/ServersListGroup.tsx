import { faChevronRight as chevronIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { Link } from 'react-router';
import type { ServerWithId } from './data';

type ServersListGroupProps = {
  servers: ServerWithId[];
  borderless?: boolean;
};

const ServerListItem = ({ id, name }: { id: string; name: string }) => (
  <Link
    to={`/server/${id}`}
    className={clsx(
      'servers-list__server-item',
      'tw:flex tw:items-center tw:justify-between tw:gap-x-2 tw:px-4 tw:py-3',
      'tw:rounded-none tw:hover:bg-lm-secondary tw:hover:dark:bg-dm-secondary',
      'tw:border-b tw:last:border-0 tw:border-lm-border tw:dark:border-dm-border',
    )}
  >
    <span className="tw:truncate">{name}</span>
    <FontAwesomeIcon icon={chevronIcon} />
  </Link>
);

export const ServersListGroup: FC<ServersListGroupProps> = ({ servers, borderless }) => (
  <>
    {servers.length > 0 && (
      <div
        data-testid="list"
        className={clsx(
          'tw:w-full tw:border-lm-border tw:dark:border-dm-border',
          'tw:md:max-h-56 tw:md:overflow-y-auto tw:-mb-1 tw:scroll-thin',
          { 'tw:border-y': !borderless },
        )}
      >
        {servers.map(({ id, name }) => <ServerListItem key={id} id={id} name={name} />)}
      </div>
    )}
  </>
);
