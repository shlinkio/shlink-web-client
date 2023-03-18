import { faFileUpload as importIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ChangeEvent, FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { createPipe } from 'remeda';
import { useElementRef, useToggle } from '../../utils/helpers/hooks';
import type { ServerData, ServersMap } from '../data';
import type { ServersImporter } from '../services/ServersImporter';
import { DuplicatedServersModal } from './DuplicatedServersModal';
import './ImportServersBtn.scss';

export type ImportServersBtnProps = PropsWithChildren<{
  onImport?: () => void;
  onImportError?: (error: Error) => void;
  tooltipPlacement?: 'top' | 'bottom';
  className?: string;
}>;

interface ImportServersBtnConnectProps extends ImportServersBtnProps {
  createServers: (servers: ServerData[]) => void;
  servers: ServersMap;
}

const serversFiltering = (servers: ServerData[]) =>
  ({ url, apiKey }: ServerData) => servers.some((server) => server.url === url && server.apiKey === apiKey);

export const ImportServersBtn = ({ importServersFromFile }: ServersImporter): FC<ImportServersBtnConnectProps> => ({
  createServers,
  servers,
  children,
  onImport = () => {},
  onImportError = () => {},
  tooltipPlacement = 'bottom',
  className = '',
}) => {
  const ref = useElementRef<HTMLInputElement>();
  const [serversToCreate, setServersToCreate] = useState<ServerData[] | undefined>();
  const [duplicatedServers, setDuplicatedServers] = useState<ServerData[]>([]);
  const [isModalOpen,, showModal, hideModal] = useToggle();
  const create = createPipe(createServers, onImport);
  const createAllServers = createPipe<void, void, void>(() => create(serversToCreate ?? []), hideModal);
  const createNonDuplicatedServers = createPipe<void, void, void>(
    () => create((serversToCreate ?? []).filter((serverData) => !serversFiltering(duplicatedServers)(serverData))),
    hideModal,
  );
  const onFile = async ({ target }: ChangeEvent<HTMLInputElement>) =>
    importServersFromFile(target.files?.[0])
      .then(setServersToCreate)
      .then(() => {
        // Reset input after processing file
        (target as { value: string | null }).value = null; // eslint-disable-line no-param-reassign
      })
      .catch(onImportError);

  useEffect(() => {
    if (!serversToCreate) {
      return;
    }

    const existingServers = Object.values(servers);
    const dupServers = serversToCreate.filter(serversFiltering(existingServers));
    const hasDuplicatedServers = !!dupServers.length;

    !hasDuplicatedServers ? create(serversToCreate) : setDuplicatedServers(dupServers);
    hasDuplicatedServers && showModal();
  }, [serversToCreate]);

  return (
    <>
      <Button outline id="importBtn" className={className} onClick={() => ref.current?.click()}>
        <FontAwesomeIcon icon={importIcon} fixedWidth /> {children ?? 'Import from file'}
      </Button>
      <UncontrolledTooltip placement={tooltipPlacement} target="importBtn">
        You can create servers by importing a CSV file with columns <b>name</b>, <b>apiKey</b> and <b>url</b>.
      </UncontrolledTooltip>

      <input
        type="file"
        accept="text/csv"
        className="import-servers-btn__csv-select"
        ref={ref}
        onChange={onFile}
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
