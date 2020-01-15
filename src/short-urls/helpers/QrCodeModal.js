import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { ExternalLink } from 'react-external-link';
import './QrCodeModal.scss';

const propTypes = {
  url: PropTypes.string,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
};

const QrCodeModal = ({ url, toggle, isOpen }) => (
  <Modal isOpen={isOpen} toggle={toggle} centered>
    <ModalHeader toggle={toggle}>
      QR code for <ExternalLink href={url}>{url}</ExternalLink>
    </ModalHeader>
    <ModalBody>
      <div className="text-center">
        <img src={`${url}/qr-code`} className="qr-code-modal__img" alt="QR code" />
      </div>
    </ModalBody>
  </Modal>
);

QrCodeModal.propTypes = propTypes;

export default QrCodeModal;
