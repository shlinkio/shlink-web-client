import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import './QrCodeModal.scss';

export default function QrCodeModal ({ url, toggle, isOpen }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered={true}>
      <ModalHeader toggle={toggle}>QR code for <a target="_blank" href={url}>{url}</a></ModalHeader>
      <ModalBody>
        <div className="text-center">
          <img src={`${url}/qr-code`} className="qr-code-modal__img" />
        </div>
      </ModalBody>
    </Modal>
  );
}
