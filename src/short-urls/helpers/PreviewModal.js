import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import './PreviewModal.scss';

export default function PreviewModal ({ url, toggle, isOpen }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Preview for <a target="_blank" href={url}>{url}</a></ModalHeader>
      <ModalBody>
        <div className="text-center">
          <p className="preview-modal__loader">Loading...</p>
          <img src={`${url}/preview`} className="preview-modal__img" />
        </div>
      </ModalBody>
    </Modal>
  );
}
