import { FC } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ServerData } from '../data';

interface DuplicatedServerModalProps {
  serverData?: ServerData;
  isOpen: boolean;
  toggle: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

export const DuplicatedServerModal: FC<DuplicatedServerModalProps> = (
  { isOpen, toggle, serverData, onDiscard, onSave },
) => (
  <Modal centered isOpen={isOpen} toggle={toggle}>
    <ModalHeader>Duplicated server</ModalHeader>
    <ModalBody>
      <p>There is already a server with:</p>
      <ul>
        <li>URL: <b>{serverData?.url}</b></li>
        <li>API key: <b>{serverData?.apiKey}</b></li>
      </ul>
      Do you want to save this server anyway?
    </ModalBody>
    <ModalFooter>
      <Button color="link" onClick={onDiscard}>Discard</Button>
      <Button color="primary" onClick={onSave}>Save anyway</Button>
    </ModalFooter>
  </Modal>
);
