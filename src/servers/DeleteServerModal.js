import PropTypes from 'prop-types';
import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { serverType } from './prop-types';

const propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  server: serverType,
  deleteServer: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const DeleteServerModal = ({ server, toggle, isOpen, deleteServer, history }) => {
  const closeModal = () => {
    deleteServer(server);
    toggle();
    history.push('/');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}><span className="text-danger">Remove server</span></ModalHeader>
      <ModalBody>
        <p>Are you sure you want to remove <b>{server ? server.name : ''}</b>?</p>
        <p>
          <i>
            No data will be deleted, only the access to this server will be removed from this host.
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

DeleteServerModal.propTypes = propTypes;

export default DeleteServerModal;
