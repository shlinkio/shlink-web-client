import { isEmpty, values } from 'ramda';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { Link } from 'react-router-dom';
import { faPlus as plusIcon, faFileDownload as exportIcon, faServer as serverIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ServersExporter from './services/ServersExporter';
import { isServerWithId, SelectedServer, ServersMap } from './data';

export interface ServersDropdownProps {
  servers: ServersMap;
  selectedServer: SelectedServer;
}

const ServersDropdown = (serversExporter: ServersExporter) => ({ servers, selectedServer }: ServersDropdownProps) => {
  const serversList = values(servers);
  const createServerItem = (
    <DropdownItem tag={Link} to="/server/create">
      <FontAwesomeIcon icon={plusIcon} /> <span className="ml-1">Add a server</span>
    </DropdownItem>
  );

  const renderServers = () => {
    if (isEmpty(serversList)) {
      return createServerItem;
    }

    return (
      <>
        {serversList.map(({ name, id }) => (
          <DropdownItem
            key={id}
            tag={Link}
            to={`/server/${id}`}
            active={isServerWithId(selectedServer) && selectedServer.id === id}
          >
            {name}
          </DropdownItem>
        ))}
        <DropdownItem divider />
        {createServerItem}
        <DropdownItem className="servers-dropdown__export-item" onClick={async () => serversExporter.exportServers()}>
          <FontAwesomeIcon icon={exportIcon} /> <span className="ml-1">Export servers</span>
        </DropdownItem>
      </>
    );
  };

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon={serverIcon} /> <span className="ml-1">Servers</span>
      </DropdownToggle>
      <DropdownMenu right>{renderServers()}</DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default ServersDropdown;
