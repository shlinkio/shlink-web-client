import { faFileDownload as exportIcon, faPlus as plusIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { TimeoutToggle } from '@shlinkio/shlink-frontend-kit';
import { Button, Result, SearchInput, SimpleCard, Table } from '@shlinkio/shlink-frontend-kit';
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
  const [errorImporting, setErrorImporting] = useTimeoutToggle({ delay: SHOW_IMPORT_MSG_TIME });

  return (
    <NoMenuLayout className="flex flex-col gap-y-4">
      <SearchInput onChange={setSearchTerm} />

      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex gap-2">
          <ImportServersBtn className="flex-grow" onError={setErrorImporting}>Import servers</ImportServersBtn>
          {filteredServers.length > 0 && (
            <Button variant="secondary" className="flex-grow" onClick={async () => serversExporter.exportServers()}>
              <FontAwesomeIcon icon={exportIcon} /> Export servers
            </Button>
          )}
        </div>
        <Button className="md:ml-auto" to="/server/create">
          <FontAwesomeIcon icon={plusIcon} /> Add a server
        </Button>
      </div>

      <SimpleCard className="card">
        <Table header={(
          <Table.Row>
            {hasAutoConnect && (
              <Table.Cell className="w-[35px]"><span className="sr-only">Auto-connect</span></Table.Cell>
            )}
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>Base URL</Table.Cell>
            <Table.Cell><span className="sr-only">Options</span></Table.Cell>
          </Table.Row>
        )}>
          {!filteredServers.length && (
            <Table.Row className="text-center"><Table.Cell colSpan={4}>No servers found.</Table.Cell></Table.Row>
          )}
          {filteredServers.map((server) => (
            <ManageServersRow key={server.id} server={server} hasAutoConnect={hasAutoConnect} />
          ))}
        </Table>
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
