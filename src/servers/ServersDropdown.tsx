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

  const renderServers = () => {
    if (serversList.length === 0) {
      return (
        <DropdownItem tag={Link} to="/server/create">
          <FontAwesomeIcon icon={plusIcon} /> <span className="tw:ml-1">Add a server</span>
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
        <DropdownItem divider tag="hr" />
        <DropdownItem tag={Link} to="/manage-servers">
          <FontAwesomeIcon icon={serverIcon} /> <span className="tw:ml-1">Manage servers</span>
        </DropdownItem>
      </>
    );
  };

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon={serverIcon} /> <span className="tw:ml-1">Servers</span>
      </DropdownToggle>
      <DropdownMenu end classNam="tw:right-0">{renderServers()}</DropdownMenu>
    </UncontrolledDropdown>
  );
};
