import { faFileDownload as exportIcon, faPlus as plusIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { TimeoutToggle } from '@shlinkio/shlink-frontend-kit';
import { Button, Result, SearchInput, SimpleCard } from '@shlinkio/shlink-frontend-kit/tailwind';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const allServers = useMemo(() => Object.values(servers), [servers]);
  const filteredServers = useMemo(
    () => allServers.filter(({ name, url }) => `${name} ${url}`.toLowerCase().match(searchTerm.toLowerCase())),
    [allServers, searchTerm],
  );
  const hasAutoConnect = allServers.some(({ autoConnect }) => !!autoConnect);
  // eslint-disable-next-line react-compiler/react-compiler
  const [errorImporting, setErrorImporting] = useTimeoutToggle(false, SHOW_IMPORT_MSG_TIME);

  return (
    <NoMenuLayout className="d-flex flex-column gap-3">
      <SearchInput onChange={setSearchTerm} />

      <div className="d-flex flex-column flex-md-row gap-2">
        <div className="d-flex gap-2">
          <ImportServersBtn className="flex-fill" onImportError={setErrorImporting}>Import servers</ImportServersBtn>
          {filteredServers.length > 0 && (
            <Button variant="secondary" className="flex-fill" onClick={async () => serversExporter.exportServers()}>
              <FontAwesomeIcon icon={exportIcon} fixedWidth /> Export servers
            </Button>
          )}
        </div>
        <Button className="ms-md-auto" to="/server/create">
          <FontAwesomeIcon icon={plusIcon} fixedWidth /> Add a server
        </Button>
      </div>

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
            {!filteredServers.length && <tr className="text-center"><td colSpan={4}>No servers found.</td></tr>}
            {filteredServers.map((server) => (
              <ManageServersRow key={server.id} server={server} hasAutoConnect={hasAutoConnect} />
            ))}
          </tbody>
        </table>
      </SimpleCard>

      {errorImporting && (
        <div>
          <Result variant="error">The servers could not be imported. Make sure the format is correct.</Result>
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
