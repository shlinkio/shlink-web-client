import { faFileUpload as importIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip, useToggle , useTooltip } from '@shlinkio/shlink-frontend-kit';
import type { ChangeEvent, PropsWithChildren } from 'react';
import { useCallback, useRef, useState } from 'react';
import type { FCWithDeps } from '../../container/utils';
import { componentFactory, useDependencies } from '../../container/utils';
import type { ServerData, ServersMap, ServerWithId } from '../data';
import type { ServersImporter } from '../services/ServersImporter';
import { DuplicatedServersModal } from './DuplicatedServersModal';
import { dedupServers, ensureUniqueIds } from './index';

export type ImportServersBtnProps = PropsWithChildren<{
  onImport?: () => void;
  onError?: (error: Error) => void;
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
  onImport,
  onError = () => {},
  tooltipPlacement = 'bottom',
  className = '',
}) => {
  const { ServersImporter: serversImporter } = useDependencies(ImportServersBtn);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { anchor, tooltip } = useTooltip({ placement: tooltipPlacement });
  const [duplicatedServers, setDuplicatedServers] = useState<ServerData[]>([]);
  const { flag: isModalOpen, setToTrue: showModal, setToFalse: hideModal } = useToggle();
  const newServersCreatedRef = useRef(false);

  const onFile = useCallback(
    async ({ target }: ChangeEvent<HTMLInputElement>) =>
      serversImporter.importServersFromFile(target.files?.[0])
        .then((importedServers) => {
          const { duplicatedServers, newServers } = dedupServers(servers, importedServers);

          // Immediately create new servers
          newServersCreatedRef.current = newServers.length > 0;
          createServers(ensureUniqueIds(servers, newServers));

          // For duplicated servers, ask for confirmation
          if (duplicatedServers.length > 0) {
            setDuplicatedServers(duplicatedServers);
            showModal();
          } else {
            onImport?.();
          }
        })
        .then(() => {
          // Reset file input after processing file
          (target as { value: string | null }).value = null;
        })
        .catch(onError),
    [createServers, onError, onImport, servers, serversImporter, showModal],
  );

  const createDuplicatedServers = useCallback(() => {
    createServers(ensureUniqueIds(servers, duplicatedServers));
    hideModal();
    onImport?.();
  }, [createServers, duplicatedServers, hideModal, onImport, servers]);
  const discardDuplicatedServers = useCallback(() => {
    hideModal();
    // If duplicated servers were discarded but some non-duplicated servers were created, call onImport
    if (newServersCreatedRef.current) {
      onImport?.();
    }
  }, [hideModal, onImport]);

  return (
    <>
      <Button variant="secondary" className={className} onClick={() => fileInputRef.current?.click()} {...anchor}>
        <FontAwesomeIcon icon={importIcon} fixedWidth /> {children ?? 'Import from file'}
      </Button>
      <Tooltip {...tooltip}>
        You can create servers by importing a CSV file with <b>name</b>, <b>apiKey</b> and <b>url</b> columns.
      </Tooltip>

      <input
        type="file"
        accept=".csv"
        className="hidden"
        aria-hidden
        tabIndex={-1}
        ref={fileInputRef}
        onChange={onFile}
        data-testid="csv-file-input"
      />

      <DuplicatedServersModal
        open={isModalOpen}
        duplicatedServers={duplicatedServers}
        onClose={discardDuplicatedServers}
        onConfirm={createDuplicatedServers}
      />
    </>
  );
};

export const ImportServersBtnFactory = componentFactory(ImportServersBtn, ['ServersImporter']);
