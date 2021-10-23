import { FC } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck as checkIcon } from '@fortawesome/free-solid-svg-icons';
import { ServerWithId } from './data';
import { ManageServersRowDropdownProps } from './ManageServersRowDropdown';

export interface ManageServersRowProps {
  server: ServerWithId;
  hasAutoConnect: boolean;
}

export const ManageServersRow = (
  ManageServersRowDropdown: FC<ManageServersRowDropdownProps>,
): FC<ManageServersRowProps> => ({ server, hasAutoConnect }) => (
  <tr className="responsive-table__row">
    {hasAutoConnect && (
      <td className="responsive-table__cell" data-th="Auto-connect">
        {server.autoConnect && (
          <>
            <FontAwesomeIcon icon={checkIcon} className="text-primary" id="autoConnectIcon" />
            <UncontrolledTooltip target="autoConnectIcon" placement="right">
              Auto-connect to this server
            </UncontrolledTooltip>
          </>
        )}
      </td>
    )}
    <th className="responsive-table__cell" data-th="Name">
      <Link to={`/server/${server.id}`}>{server.name}</Link>
    </th>
    <td className="responsive-table__cell" data-th="Base URL">{server.url}</td>
    <td className="responsive-table__cell text-right">
      <ManageServersRowDropdown server={server} />
    </td>
  </tr>
);
