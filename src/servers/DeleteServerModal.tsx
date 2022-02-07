import { FC } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { ServerWithId } from './data';

export interface DeleteServerModalProps {
  server: ServerWithId;
  toggle: () => void;
  isOpen: boolean;
  redirectHome?: boolean;
}

interface DeleteServerModalConnectProps extends DeleteServerModalProps {
  deleteServer: (server: ServerWithId) => void;
}

const DeleteServerModal: FC<DeleteServerModalConnectProps> = (
  { server, toggle, isOpen, deleteServer, redirectHome = true },
) => {
  const navigate = useNavigate();
  const closeModal = () => {
    deleteServer(server);
    toggle();
    redirectHome && navigate('/');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}><span className="text-danger">Remove server</span></ModalHeader>
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
        <button className="btn btn-link" onClick={toggle}>Cancel</button>
        <button className="btn btn-danger" onClick={() => closeModal()}>Delete</button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteServerModal;
