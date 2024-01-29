import { faFileDownload as exportIcon, faPlus as plusIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { TimeoutToggle } from '@shlinkio/shlink-frontend-kit';
import { Result, SearchField, SimpleCard } from '@shlinkio/shlink-frontend-kit';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row } from 'reactstrap';
import { NoMenuLayout } from '../common/NoMenuLayout';
import type { FCWithDeps } from '../container/utils';
import { componentFactory, useDependencies } from '../container/utils';
import type { ServersMap } from './data';
import type { ImportServersBtnProps } from './helpers/ImportServersBtn';
import type { ManageServersRowProps } from './ManageServersRow';
import type { ServersExporter } from './services/ServersExporter';

type ManageServersProps = {
  servers: ServersMap;
};

type ManageServersDeps = {
  ServersExporter: ServersExporter;
  ImportServersBtn: FC<ImportServersBtnProps>;
  useTimeoutToggle: TimeoutToggle;
  ManageServersRow: FC<ManageServersRowProps>;
};

const SHOW_IMPORT_MSG_TIME = 4000;

const ManageServers: FCWithDeps<ManageServersProps, ManageServersDeps> = ({ servers }) => {
  const {
    ServersExporter: serversExporter,
    ImportServersBtn,
    useTimeoutToggle,
    ManageServersRow,
  } = useDependencies(ManageServers);
  const allServers = Object.values(servers);
  const [serversList, setServersList] = useState(allServers);
  const filterServers = (searchTerm: string) => setServersList(
    allServers.filter(({ name, url }) => `${name} ${url}`.toLowerCase().match(searchTerm.toLowerCase())),
  );
  const hasAutoConnect = serversList.some(({ autoConnect }) => !!autoConnect);
  const [errorImporting, setErrorImporting] = useTimeoutToggle(false, SHOW_IMPORT_MSG_TIME);

  useEffect(() => {
    setServersList(Object.values(servers));
  }, [servers]);

  return (
    <NoMenuLayout>
      <SearchField className="mb-3" onChange={filterServers} />

      <Row className="mb-3">
        <div className="col-md-6 d-flex d-md-block mb-2 mb-md-0">
          <ImportServersBtn className="flex-fill" onImportError={setErrorImporting}>Import servers</ImportServersBtn>
          {allServers.length > 0 && (
            <Button outline className="ms-2 flex-fill" onClick={async () => serversExporter.exportServers()}>
              <FontAwesomeIcon icon={exportIcon} fixedWidth /> Export servers
            </Button>
          )}
        </div>
        <div className="col-md-6 text-md-end d-flex d-md-block">
          <Button outline color="primary" className="flex-fill" tag={Link} to="/server/create">
            <FontAwesomeIcon icon={plusIcon} fixedWidth /> Add a server
          </Button>
        </div>
      </Row>

      <SimpleCard>
        <table className="table table-hover responsive-table mb-0">
          <thead className="responsive-table__header">
            <tr>
              {hasAutoConnect && <th style={{ width: '50px' }}><span className="sr-only">Auto-connect</span></th>}
              <th>Name</th>
              <th>Base URL</th>
              <th><span className="sr-only">Options</span></th>
            </tr>
          </thead>
          <tbody>
            {!serversList.length && <tr className="text-center"><td colSpan={4}>No servers found.</td></tr>}
            {serversList.map((server) => (
              <ManageServersRow key={server.id} server={server} hasAutoConnect={hasAutoConnect} />
            ))}
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

export const ManageServersFactory = componentFactory(ManageServers, [
  'ServersExporter',
  'ImportServersBtn',
  'useTimeoutToggle',
  'ManageServersRow',
]);
