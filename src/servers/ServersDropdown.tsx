import { faPlus as plusIcon, faServer as serverIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, NavBar } from '@shlinkio/shlink-frontend-kit/tailwind';
import type { SelectedServer, ServersMap } from './data';
import { getServerId } from './data';

export interface ServersDropdownProps {
  servers: ServersMap;
  selectedServer: SelectedServer;
}

export const ServersDropdown = ({ servers, selectedServer }: ServersDropdownProps) => {
  const serversList = Object.values(servers);

  return (
    <NavBar.Dropdown buttonContent={(
      <span className="tw:flex tw:items-center tw:gap-1.5">
        <FontAwesomeIcon icon={serverIcon} fixedWidth /> Servers
      </span>
    )}>
      {serversList.length === 0 ? (
        <Dropdown.Item to="/server/create">
          <FontAwesomeIcon icon={plusIcon} /> Add a server
        </Dropdown.Item>
      ) : (
        <>
          {serversList.map(({ name, id }) => (
            <Dropdown.Item key={id} to={`/server/${id}`} selected={getServerId(selectedServer) === id}>
              {name}
            </Dropdown.Item>
          ))}
          <Dropdown.Separator />
          <Dropdown.Item to="/manage-servers">
            <FontAwesomeIcon icon={serverIcon} /> Manage servers
          </Dropdown.Item>
        </>
      )}
    </NavBar.Dropdown>
  );
};
