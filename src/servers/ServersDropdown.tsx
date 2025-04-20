import { faPlus as plusIcon, faServer as serverIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import type { SelectedServer, ServersMap } from './data';
import { getServerId } from './data';

export interface ServersDropdownProps {
  servers: ServersMap;
  selectedServer: SelectedServer;
}

export const ServersDropdown = ({ servers, selectedServer }: ServersDropdownProps) => {
  const serversList = Object.values(servers);

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon={serverIcon} /> <span className="tw:ml-1">Servers</span>
      </DropdownToggle>
      <DropdownMenu end className="tw:right-0">
        {serversList.length === 0 ? (
          <DropdownItem tag={Link} to="/server/create">
            <FontAwesomeIcon icon={plusIcon} /> <span className="tw:ml-1">Add a server</span>
          </DropdownItem>
        ) : (
          <>
            {serversList.map(({ name, id }) => (
              <DropdownItem key={id} tag={Link} to={`/server/${id}`} active={getServerId(selectedServer) === id}>
                {name}
              </DropdownItem>
            ))}
            <DropdownItem divider tag="hr" />
            <DropdownItem tag={Link} to="/manage-servers">
              <FontAwesomeIcon icon={serverIcon} /> <span className="tw:ml-1">Manage servers</span>
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
