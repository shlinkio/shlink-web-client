import { useMemo, useState } from 'react';
import { DropdownItem, FormGroup, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import CopyToClipboard from 'react-copy-to-clipboard';
import { faCopy as copyIcon } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ShortUrlModalProps } from '../data';
import { ReachableServer } from '../../servers/data';
import { versionMatch } from '../../utils/helpers/version';
import { DropdownBtn } from '../../utils/DropdownBtn';
import './QrCodeModal.scss';

interface QrCodeModalConnectProps extends ShortUrlModalProps {
  selectedServer: ReachableServer;
}

type QrCodeFormat = 'svg' | 'png';

const buildQrCodeUrl = (shortUrl: string, size: number, format: QrCodeFormat, version: string): string => {
  const useSizeInPath = !versionMatch(version, { minVersion: '2.5.0' });
  const svgIsSupported = versionMatch(version, { minVersion: '2.4.0' });
  const sizeFragment = useSizeInPath ? `/${size}?` : `?size=${size}&`;
  const formatFragment = !svgIsSupported ? '' : `format=${format}`;

  return `${shortUrl}/qr-code${sizeFragment}${formatFragment}`;
};

const QrCodeModal = ({ shortUrl: { shortUrl }, toggle, isOpen, selectedServer }: QrCodeModalConnectProps) => {
  const [ size, setSize ] = useState(300);
  const [ format, setFormat ] = useState<QrCodeFormat>('png');
  const qrCodeUrl = useMemo(
    () => buildQrCodeUrl(shortUrl, size, format, selectedServer.version),
    [ shortUrl, size, format, selectedServer ],
  );
  const modalSize = useMemo(() => {
    if (size < 500) {
      return undefined;
    }

    return size < 800 ? 'lg' : 'xl';
  }, [ size ]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size={modalSize}>
      <ModalHeader toggle={toggle}>
        QR code for <ExternalLink href={shortUrl}>{shortUrl}</ExternalLink>
      </ModalHeader>
      <ModalBody>
        <Row className="mb-2">
          <div className="col-md-6">
            <FormGroup>
              <label className="mb-0">Size: {size}px</label>
              <input
                type="range"
                className="form-control-range"
                value={size}
                step={10}
                min={50}
                max={1000}
                onChange={(e) => setSize(Number(e.target.value))}
              />
            </FormGroup>
          </div>
          <div className="col-md-6">
            <DropdownBtn text={`Format (${format})`}>
              <DropdownItem active={format === 'png'} onClick={() => setFormat('png')}>PNG</DropdownItem>
              <DropdownItem active={format === 'svg'} onClick={() => setFormat('svg')}>SVG</DropdownItem>
            </DropdownBtn>
          </div>
        </Row>
        <div className="text-center">
          <div className="mb-3">
            <div>QR code URL:</div>
            <ExternalLink className="indivisible" href={qrCodeUrl} />
            <CopyToClipboard text={qrCodeUrl}>
              <FontAwesomeIcon icon={copyIcon} className="ml-2" />
            </CopyToClipboard>
          </div>
          <img src={qrCodeUrl} className="qr-code-modal__img" alt="QR code" />
          <div className="mt-2">{size}x{size}</div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default QrCodeModal;
