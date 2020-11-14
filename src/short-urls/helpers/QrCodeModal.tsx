import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import { ShortUrlModalProps } from '../data';
import './QrCodeModal.scss';

const QrCodeModal = ({ shortUrl: { shortUrl }, toggle, isOpen }: ShortUrlModalProps) => (
  <Modal isOpen={isOpen} toggle={toggle} centered>
    <ModalHeader toggle={toggle}>
      QR code for <ExternalLink href={shortUrl}>{shortUrl}</ExternalLink>
    </ModalHeader>
    <ModalBody>
      <div className="text-center">
        <img src={`${shortUrl}/qr-code`} className="qr-code-modal__img" alt="QR code" />
      </div>
    </ModalBody>
  </Modal>
);

export default QrCodeModal;
