import { faFileUpload as importIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useElementRef, useToggle } from '@shlinkio/shlink-frontend-kit';
import { Button } from '@shlinkio/shlink-frontend-kit/tailwind';
import type { ChangeEvent, PropsWithChildren } from 'react';
import { useCallback, useRef, useState } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import type { FCWithDeps } from '../../container/utils';
import { componentFactory, useDependencies } from '../../container/utils';
import type { ServerData, ServersMap, ServerWithId } from '../data';
import type { ServersImporter } from '../services/ServersImporter';
import { DuplicatedServersModal } from './DuplicatedServersModal';
import { dedupServers, ensureUniqueIds } from './index';

export type ImportServersBtnProps = PropsWithChildren<{
  onImport?: () => void;
  onImportError?: (error: Error) => void;
  tooltipPlacement?: 'top' | 'bottom';
  className?: string;
}>;

type ImportServersBtnConnectProps = ImportServersBtnProps & {
  createServers: (servers: ServerWithId[]) => void;
  servers: ServersMap;
};

type ImportServersBtnDeps = {
  ServersImporter: ServersImporter
};

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

  const importedServersRef = useRef<ServerWithId[]>([]);
  const newServersRef = useRef<ServerWithId[]>([]);

  const create = useCallback((serversData: ServerWithId[]) => {
    createServers(serversData);
    onImport();
  }, [createServers, onImport]);
  const onFile = useCallback(
    async ({ target }: ChangeEvent<HTMLInputElement>) =>
      serversImporter.importServersFromFile(target.files?.[0])
        .then((importedServers) => {
          const { duplicatedServers, newServers } = dedupServers(servers, importedServers);

          importedServersRef.current = ensureUniqueIds(servers, importedServers);
          newServersRef.current = ensureUniqueIds(servers, newServers);

          if (duplicatedServers.length === 0) {
            create(importedServersRef.current);
          } else {
            setDuplicatedServers(duplicatedServers);
            showModal();
          }
        })
        .then(() => {
          // Reset file input after processing file
          (target as { value: string | null }).value = null;
        })
        .catch(onImportError),
    [create, onImportError, servers, serversImporter, showModal],
  );

  const createAllServers = useCallback(() => {
    create(importedServersRef.current);
    hideModal();
  }, [create, hideModal]);
  const createNonDuplicatedServers = useCallback(() => {
    create(newServersRef.current);
    hideModal();
  }, [create, hideModal]);

  return (
    <>
      <Button variant="secondary" id="importBtn" className={className} onClick={() => ref.current?.click()}>
        <FontAwesomeIcon icon={importIcon} fixedWidth /> {children ?? 'Import from file'}
      </Button>
      <UncontrolledTooltip placement={tooltipPlacement} target="importBtn">
        You can create servers by importing a CSV file with <b>name</b>, <b>apiKey</b> and <b>url</b> columns.
      </UncontrolledTooltip>

      <input
        type="file"
        accept=".csv"
        className="d-none"
        aria-hidden
        ref={ref as any /* TODO Remove After updating to React 19 */}
        onChange={onFile}
        data-testid="csv-file-input"
      />

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
