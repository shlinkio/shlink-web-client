import { FC, Fragment } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ServerData } from '../data';

interface DuplicatedServersModalProps {
  duplicatedServers: ServerData[];
  isOpen: boolean;
  onDiscard: () => void;
  onSave: () => void;
}

export const DuplicatedServersModal: FC<DuplicatedServersModalProps> = (
  { isOpen, duplicatedServers, onDiscard, onSave },
) => {
  const hasMultipleServers = duplicatedServers.length > 1;

  return (
    <Modal centered isOpen={isOpen}>
      <ModalHeader>Duplicated server{hasMultipleServers && 's'}</ModalHeader>
      <ModalBody>
        <p>{hasMultipleServers ? 'The next servers already exist:' : 'There is already a server with:'}</p>
        <ul>
          {duplicatedServers.map(({ url, apiKey }, index) => (!hasMultipleServers ? (
            <Fragment key={index}>
              <li>URL: <b>{url}</b></li>
              <li>API key: <b>{apiKey}</b></li>
            </Fragment>
          ) : <li key={index}><b>{url}</b> - <b>{apiKey}</b></li>))}
        </ul>
        <span>
          {hasMultipleServers ? 'Do you want to ignore duplicated servers' : 'Do you want to save this server anyway'}?
        </span>
      </ModalBody>
      <ModalFooter>
        <Button color="link" onClick={onDiscard}>{hasMultipleServers ? 'Ignore duplicated' : 'Discard'}</Button>
        <Button color="primary" onClick={onSave}>Save anyway</Button>
      </ModalFooter>
    </Modal>
  );
};
