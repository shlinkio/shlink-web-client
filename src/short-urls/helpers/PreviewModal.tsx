import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import { ShortUrlModalProps } from '../data';
import './PreviewModal.scss';

const PreviewModal = ({ shortUrl: { shortUrl }, toggle, isOpen }: ShortUrlModalProps) => (
  <Modal isOpen={isOpen} toggle={toggle} size="lg">
    <ModalHeader toggle={toggle}>
      Preview for <ExternalLink href={shortUrl}>{shortUrl}</ExternalLink>
    </ModalHeader>
    <ModalBody>
      <div className="text-center">
        <p className="preview-modal__loader">Loading...</p>
        <img src={`${shortUrl}/preview`} className="preview-modal__img" alt="Preview" />
      </div>
    </ModalBody>
  </Modal>
);

export default PreviewModal;
