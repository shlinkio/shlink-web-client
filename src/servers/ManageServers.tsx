import { FC, useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { faFileDownload as exportIcon, faPlus as plusIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import NoMenuLayout from '../common/NoMenuLayout';
import { SimpleCard } from '../utils/SimpleCard';
import SearchField from '../utils/SearchField';
import { Result } from '../utils/Result';
import { StateFlagTimeout } from '../utils/helpers/hooks';
import { ImportServersBtnProps } from './helpers/ImportServersBtn';
import { ServersMap } from './data';
import { ManageServersRowProps } from './ManageServersRow';
import ServersExporter from './services/ServersExporter';

interface ManageServersProps {
  servers: ServersMap;
}

const SHOW_IMPORT_MSG_TIME = 4000;

export const ManageServers = (
  serversExporter: ServersExporter,
  ImportServersBtn: FC<ImportServersBtnProps>,
  useStateFlagTimeout: StateFlagTimeout,
  ManageServersRow: FC<ManageServersRowProps>,
): FC<ManageServersProps> => ({ servers }) => {
  const allServers = Object.values(servers);
  const [ serversList, setServersList ] = useState(allServers);
  const filterServers = (searchTerm: string) => setServersList(
    allServers.filter(({ name, url }) => `${name} ${url}`.match(searchTerm)),
  );
  const hasAutoConnect = serversList.some(({ autoConnect }) => !!autoConnect);
  const [ errorImporting, setErrorImporting ] = useStateFlagTimeout(false, SHOW_IMPORT_MSG_TIME);

  useEffect(() => {
    setServersList(Object.values(servers));
  }, [ servers ]);

  return (
    <NoMenuLayout>
      <SearchField className="mb-3" onChange={filterServers} />

      <div className="mb-3 d-flex flex-row">
        <ImportServersBtn onImportError={setErrorImporting} />
        <Button outline className="ml-2" onClick={async () => serversExporter.exportServers()}>
          <FontAwesomeIcon icon={exportIcon} fixedWidth /> Export servers
        </Button>
        <Button outline color="primary" className="ml-auto" tag={Link} to="/server/create">
          <FontAwesomeIcon icon={plusIcon} fixedWidth /> Add a server
        </Button>
      </div>

      <SimpleCard title="Shlink servers">
        <table className="table table-hover mb-0">
          <thead className="responsive-table__header">
            <tr>
              {hasAutoConnect && <th />}
              <th>Name</th>
              <th>Base URL</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {!serversList.length && <tr className="text-center"><td colSpan={4}>No servers found.</td></tr>}
            {serversList.map((server) =>
              <ManageServersRow key={server.id} server={server} hasAutoConnect={hasAutoConnect} />)
            }
          </tbody>
        </table>
      </SimpleCard>

      {errorImporting && (
        <div className="mt-3">
          <Result type="error">The servers could not be imported. Make sure the format is correct.</Result>
        </div>
      )}
    </NoMenuLayout>
  );
};
