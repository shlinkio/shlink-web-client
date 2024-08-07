import type { FC } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import type { ServerWithId } from './data';

export interface DeleteServerModalProps {
  server: ServerWithId;
  toggle: () => void;
  isOpen: boolean;
  redirectHome?: boolean;
}

interface DeleteServerModalConnectProps extends DeleteServerModalProps {
  deleteServer: (server: ServerWithId) => void;
}

export const DeleteServerModal: FC<DeleteServerModalConnectProps> = (
  { server, toggle, isOpen, deleteServer, redirectHome = true },
) => {
  const navigate = useNavigate();
  const doDelete = useRef<boolean>(false);
  const toggleAndDelete = () => {
    doDelete.current = true;
    toggle();
  };
  const onClosed = () => {
    if (!doDelete.current) {
      return;
    }

    deleteServer(server);
    if (redirectHome) {
      navigate('/');
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered onClosed={onClosed}>
      <ModalHeader toggle={toggle} className="text-danger">Remove server</ModalHeader>
      <ModalBody>
        <p>Are you sure you want to remove <b>{server ? server.name : ''}</b>?</p>
        <p>
          <i>
            No data will be deleted, only the access to this server will be removed from this device.
            You can create it again at any moment.
          </i>
        </p>
      </ModalBody>
      <ModalFooter>
        <Button color="link" onClick={toggle}>Cancel</Button>
        <Button color="danger" onClick={toggleAndDelete}>Delete</Button>
      </ModalFooter>
    </Modal>
  );
};
