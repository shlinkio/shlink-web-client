import { faCheck as checkIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table, Tooltip, useTooltip } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { Link } from 'react-router';
import type { ServerWithId } from './data';
import { ManageServersRowDropdown } from './ManageServersRowDropdown';

export type ManageServersRowProps = {
  server: ServerWithId;
  hasAutoConnect: boolean;
};

export const ManageServersRow: FC<ManageServersRowProps> = ({ server, hasAutoConnect }) => {
  const { anchor, tooltip } = useTooltip();

  return (
    <Table.Row className="relative">
      {hasAutoConnect && (
        <Table.Cell columnName="Auto-connect">
          {server.autoConnect && (
            <>
              <FontAwesomeIcon
                icon={checkIcon}
                className="text-lm-brand dark:text-dm-brand"
                {...anchor}
                data-testid="auto-connect"
              />
              <Tooltip {...tooltip}>Auto-connect to this server</Tooltip>
            </>
          )}
        </Table.Cell>
      )}
      <Table.Cell className="font-bold" columnName="Name">
        <Link to={`/server/${server.id}`}>{server.name}</Link>
      </Table.Cell>
      <Table.Cell columnName="Base URL" className="max-lg:border-b-0">
        {server.url}
      </Table.Cell>
      <Table.Cell className="text-right max-lg:absolute right-0 -top-1 mx-lg:pt-0">
        <ManageServersRowDropdown server={server} />
      </Table.Cell>
    </Table.Row>
  );
};
