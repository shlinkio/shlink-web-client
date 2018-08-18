import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  tag: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default function DeleteTagConfirmModal({ tag, toggle, isOpen }) {
  return (
    <Modal toggle={toggle} isOpen={isOpen} centered>
      <ModalHeader toggle={toggle}>
        <span className="text-danger">Delete tag</span>
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete tag <b>{tag}</b>?
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-link" onClick={toggle}>Cancel</button>
        <button className="btn btn-danger">Delete tag</button>
      </ModalFooter>
    </Modal>
  );
}

DeleteTagConfirmModal.propTypes = propTypes;
