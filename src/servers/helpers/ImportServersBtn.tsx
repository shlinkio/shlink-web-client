import { faFileUpload as importIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useElementRef, useToggle } from '@shlinkio/shlink-frontend-kit';
import type { ChangeEvent, PropsWithChildren } from 'react';
import { useCallback, useRef, useState } from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import type { FCWithDeps } from '../../container/utils';
import { componentFactory, useDependencies } from '../../container/utils';
import type { ServerData, ServersMap } from '../data';
import type { ServersImporter } from '../services/ServersImporter';
import { DuplicatedServersModal } from './DuplicatedServersModal';

export type ImportServersBtnProps = PropsWithChildren<{
  onImport?: () => void;
  onImportError?: (error: Error) => void;
  tooltipPlacement?: 'top' | 'bottom';
  className?: string;
}>;

type ImportServersBtnConnectProps = ImportServersBtnProps & {
  createServers: (servers: ServerData[]) => void;
  servers: ServersMap;
};

type ImportServersBtnDeps = {
  ServersImporter: ServersImporter
};

const serversInclude = (servers: ServerData[], { url, apiKey }: ServerData) =>
  servers.some((server) => server.url === url && server.apiKey === apiKey);

const ImportServersBtn: FCWithDeps<ImportServersBtnConnectProps, ImportServersBtnDeps> = ({
  createServers,
  servers,
  children,
  onImport = () => {},
  onImportError = () => {},
  tooltipPlacement = 'bottom',
  className = '',
}) => {
  const { ServersImporter: serversImporter } = useDependencies(ImportServersBtn);
  const ref = useElementRef<HTMLInputElement>();
  const [duplicatedServers, setDuplicatedServers] = useState<ServerData[]>([]);
  const [isModalOpen,, showModal, hideModal] = useToggle();

  const serversToCreate = useRef<ServerData[]>([]);
  const create = useCallback((serversData: ServerData[]) => {
    createServers(serversData);
    onImport();
  }, [createServers, onImport]);
  const onFile = useCallback(
    async ({ target }: ChangeEvent<HTMLInputElement>) =>
      serversImporter.importServersFromFile(target.files?.[0])
        .then((newServers) => {
          serversToCreate.current = newServers;

          const existingServers = Object.values(servers);
          const dupServers = newServers.filter((server) => serversInclude(existingServers, server));
          const hasDuplicatedServers = !!dupServers.length;

          if (!hasDuplicatedServers) {
            create(newServers);
          } else {
            setDuplicatedServers(dupServers);
            showModal();
          }
        })
        .then(() => {
          // Reset input after processing file
          (target as { value: string | null }).value = null; // eslint-disable-line no-param-reassign
        })
        .catch(onImportError),
    [create, onImportError, servers, serversImporter, showModal],
  );

  const createAllServers = useCallback(() => {
    create(serversToCreate.current);
    hideModal();
  }, [create, hideModal, serversToCreate]);
  const createNonDuplicatedServers = useCallback(() => {
    create(serversToCreate.current.filter((server) => !serversInclude(duplicatedServers, server)));
    hideModal();
  }, [create, duplicatedServers, hideModal]);

  return (
    <>
      <Button outline id="importBtn" className={className} onClick={() => ref.current?.click()}>
        <FontAwesomeIcon icon={importIcon} fixedWidth /> {children ?? 'Import from file'}
      </Button>
      <UncontrolledTooltip placement={tooltipPlacement} target="importBtn">
        You can create servers by importing a CSV file with <b>name</b>, <b>apiKey</b> and <b>url</b> columns.
      </UncontrolledTooltip>

      <input type="file" accept=".csv" className="d-none" ref={ref} onChange={onFile} aria-hidden />

      <DuplicatedServersModal
        isOpen={isModalOpen}
        duplicatedServers={duplicatedServers}
        onDiscard={createNonDuplicatedServers}
        onSave={createAllServers}
      />
    </>
  );
};

export const ImportServersBtnFactory = componentFactory(ImportServersBtn, ['ServersImporter']);
