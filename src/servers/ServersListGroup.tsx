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
      'flex items-center justify-between gap-x-2 px-4 py-3',
      'rounded-none hover:bg-lm-secondary hover:dark:bg-dm-secondary',
      'border-b last:border-0 border-lm-border dark:border-dm-border',
    )}
  >
    <span className="truncate">{name}</span>
    <FontAwesomeIcon icon={chevronIcon} />
  </Link>
);

export const ServersListGroup: FC<ServersListGroupProps> = ({ servers, borderless }) => (
  <>
    {servers.length > 0 && (
      <div
        data-testid="list"
        className={clsx(
          'w-full border-lm-border dark:border-dm-border',
          'md:max-h-56 md:overflow-y-auto -mb-1 scroll-thin',
          { 'border-y': !borderless },
        )}
      >
        {servers.map(({ id, name }) => <ServerListItem key={id} id={id} name={name} />)}
      </div>
    )}
  </>
);
