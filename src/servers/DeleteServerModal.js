import React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { deleteServer } from './reducers/server';

export const DeleteServerModal = ({ server, deleteServer, toggle, history, isOpen }) => {
  const closeModal = () => {
    deleteServer(server);
    toggle();
    history.push('/');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered={true}>
      <ModalHeader toggle={toggle}>Delete server</ModalHeader>
      <ModalBody>Are you sure you want to delete server <b>{server ? server.name : ''}</b>.</ModalBody>
      <ModalFooter>
        <button className="btn btn-link" onClick={toggle}>Cancel</button>
        <button className="btn btn-danger" onClick={() => closeModal()}>Delete</button>
      </ModalFooter>
    </Modal>
  );
};

export default connect(null, { deleteServer })(DeleteServerModal);
