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
      <ModalHeader toggle={toggle}><span className="text-danger">Delete server</span></ModalHeader>
      <ModalBody>
        <p>Are you sure you want to delete server <b>{server ? server.name : ''}</b>?</p>
        <p>No data will be deleted, only the access to that server will be removed from this host. You can create it again at any moment.</p>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-link" onClick={toggle}>Cancel</button>
        <button className="btn btn-danger" onClick={() => closeModal()}>Delete</button>
      </ModalFooter>
    </Modal>
  );
};

export default connect(null, { deleteServer })(DeleteServerModal);
