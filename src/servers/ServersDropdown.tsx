import { isEmpty, values } from 'ramda';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { Link } from 'react-router-dom';
import ServersExporter from './services/ServersExporter';
import { isServerWithId, SelectedServer, ServersMap } from './data';

export interface ServersDropdownProps {
  servers: ServersMap;
  selectedServer: SelectedServer;
}

const ServersDropdown = (serversExporter: ServersExporter) => ({ servers, selectedServer }: ServersDropdownProps) => {
  const serversList = values(servers);

  const renderServers = () => {
    if (isEmpty(serversList)) {
      return <DropdownItem disabled><i>Add a server first...</i></DropdownItem>;
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
        <DropdownItem className="servers-dropdown__export-item" onClick={async () => serversExporter.exportServers()}>
          Export servers
        </DropdownItem>
      </>
    );
  };

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>Servers</DropdownToggle>
      <DropdownMenu right>{renderServers()}</DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default ServersDropdown;
