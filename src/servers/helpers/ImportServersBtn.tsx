import { useRef, RefObject, ChangeEvent, MutableRefObject, FC } from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { faFileUpload as importIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ServersImporter from '../services/ServersImporter';
import { ServerData } from '../data';
import './ImportServersBtn.scss';

type Ref<T> = RefObject<T> | MutableRefObject<T>;

export interface ImportServersBtnProps {
  onImport?: () => void;
  onImportError?: (error: Error) => void;
  tooltipPlacement?: 'top' | 'bottom';
  className?: string;
}

interface ImportServersBtnConnectProps extends ImportServersBtnProps {
  createServers: (servers: ServerData[]) => void;
  fileRef: Ref<HTMLInputElement>;
}

const ImportServersBtn = ({ importServersFromFile }: ServersImporter): FC<ImportServersBtnConnectProps> => ({
  createServers,
  fileRef,
  children,
  onImport = () => {},
  onImportError = () => {},
  tooltipPlacement = 'bottom',
  className = '',
}) => {
  const ref = fileRef ?? useRef<HTMLInputElement>();
  const onChange = async ({ target }: ChangeEvent<HTMLInputElement>) =>
    importServersFromFile(target.files?.[0])
      .then(createServers)
      .then(onImport)
      .then(() => {
        // Reset input after processing file
        (target as { value: string | null }).value = null;
      })
      .catch(onImportError);

  return (
    <>
      <Button outline id="importBtn" className={className} onClick={() => ref.current?.click()}>
        <FontAwesomeIcon icon={importIcon} fixedWidth /> {children ?? 'Import from file'}
      </Button>
      <UncontrolledTooltip placement={tooltipPlacement} target="importBtn">
        You can create servers by importing a CSV file with columns <b>name</b>, <b>apiKey</b> and <b>url</b>.
      </UncontrolledTooltip>

      <input type="file" accept="text/csv" className="import-servers-btn__csv-select" ref={ref} onChange={onChange} />
    </>
  );
};

export default ImportServersBtn;
