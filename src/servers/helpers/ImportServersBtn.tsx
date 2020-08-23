import React, { useRef, RefObject, ChangeEvent, MutableRefObject } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import ServersImporter from '../services/ServersImporter';
import { NewServerData } from '../data';

type Ref<T> = RefObject<T> | MutableRefObject<T>;

export interface ImportServersBtnProps {
  onImport?: () => void;
  onImportError?: () => void;
}

interface ImportServersBtnConnectProps extends ImportServersBtnProps {
  createServers: (servers: NewServerData[]) => void;
  fileRef: Ref<HTMLInputElement>;
}

const ImportServersBtn = ({ importServersFromFile }: ServersImporter) => ({
  createServers,
  fileRef,
  onImport = () => {},
  onImportError = () => {},
}: ImportServersBtnConnectProps) => {
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
    <React.Fragment>
      <button
        type="button"
        className="btn btn-outline-secondary mr-2"
        id="importBtn"
        onClick={() => ref.current?.click()}
      >
        Import from file
      </button>
      <UncontrolledTooltip placement="top" target="importBtn">
        You can create servers by importing a CSV file with columns <b>name</b>, <b>apiKey</b> and <b>url</b>.
      </UncontrolledTooltip>

      <input type="file" accept="text/csv" className="create-server__csv-select" ref={ref} onChange={onChange} />
    </React.Fragment>
  );
};

export default ImportServersBtn;
