import { useMemo, useState } from 'react';
import { DropdownItem, FormGroup, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import { ShortUrlModalProps } from '../data';
import { ReachableServer } from '../../servers/data';
import { versionMatch } from '../../utils/helpers/version';
import { DropdownBtn } from '../../utils/DropdownBtn';
import { CopyToClipboardIcon } from '../../utils/CopyToClipboardIcon';
import { buildQrCodeUrl, QrCodeCapabilities, QrCodeFormat } from '../../utils/helpers/qrCodes';
import './QrCodeModal.scss';

interface QrCodeModalConnectProps extends ShortUrlModalProps {
  selectedServer: ReachableServer;
}

const QrCodeModal = ({ shortUrl: { shortUrl }, toggle, isOpen, selectedServer }: QrCodeModalConnectProps) => {
  const [ size, setSize ] = useState(300);
  const [ format, setFormat ] = useState<QrCodeFormat>('png');
  const capabilities: QrCodeCapabilities = useMemo(() => ({
    useSizeInPath: !versionMatch(selectedServer.version, { minVersion: '2.5.0' }),
    svgIsSupported: versionMatch(selectedServer.version, { minVersion: '2.4.0' }),
  }), [ selectedServer ]);
  const qrCodeUrl = useMemo(
    () => buildQrCodeUrl(shortUrl, size, format, capabilities),
    [ shortUrl, size, format, capabilities ],
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
          <div className={capabilities.svgIsSupported ? 'col-md-6' : 'col-12'}>
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
          {capabilities.svgIsSupported && (
            <div className="col-md-6">
              <DropdownBtn text={`Format (${format})`}>
                <DropdownItem active={format === 'png'} onClick={() => setFormat('png')}>PNG</DropdownItem>
                <DropdownItem active={format === 'svg'} onClick={() => setFormat('svg')}>SVG</DropdownItem>
              </DropdownBtn>
            </div>
          )}
        </Row>
        <div className="text-center">
          <div className="mb-3">
            <div>QR code URL:</div>
            <ExternalLink className="indivisible" href={qrCodeUrl} />
            <CopyToClipboardIcon text={qrCodeUrl} />
          </div>
          <img src={qrCodeUrl} className="qr-code-modal__img" alt="QR code" />
          <div className="mt-2">{size}x{size}</div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default QrCodeModal;
