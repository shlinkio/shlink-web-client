import { faPlus as plusIcon, faServer as serverIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import type { SelectedServer, ServersMap } from './data';
import { getServerId } from './data';

export interface ServersDropdownProps {
  servers: ServersMap;
  selectedServer: SelectedServer;
}

export const ServersDropdown = ({ servers, selectedServer }: ServersDropdownProps) => {
  const serversList = Object.values(servers);

  const renderServers = () => {
    if (!serversList.length) {
      return (
        <DropdownItem tag={Link} to="/server/create">
          <FontAwesomeIcon icon={plusIcon} /> <span className="ms-1">Add a server</span>
        </DropdownItem>
      );
    }

    return (
      <>
        {serversList.map(({ name, id }) => (
          <DropdownItem key={id} tag={Link} to={`/server/${id}`} active={getServerId(selectedServer) === id}>
            {name}
          </DropdownItem>
        ))}
        <DropdownItem divider />
        <DropdownItem tag={Link} to="/manage-servers">
          <FontAwesomeIcon icon={serverIcon} /> <span className="ms-1">Manage servers</span>
        </DropdownItem>
      </>
    );
  };

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon={serverIcon} /> <span className="ms-1">Servers</span>
      </DropdownToggle>
      <DropdownMenu end style={{ right: 0 }}>{renderServers()}</DropdownMenu>
    </UncontrolledDropdown>
  );
};
