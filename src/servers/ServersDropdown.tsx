import { faPlus as plusIcon, faServer as serverIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, NavBar } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { getServerId } from './data';
import { useSelectedServer } from './reducers/selectedServer';
import { useServers } from './reducers/servers';

export const ServersDropdown: FC = () => {
  const { servers } = useServers();
  const serversList = Object.values(servers);
  const { selectedServer } = useSelectedServer();

  return (
    <NavBar.Dropdown
      buttonContent={
        <span className="flex items-center gap-1.5">
          <FontAwesomeIcon icon={serverIcon} /> Servers
        </span>
      }
    >
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
