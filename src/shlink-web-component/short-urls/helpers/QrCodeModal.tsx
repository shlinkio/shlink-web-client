import { faFileDownload as downloadIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState } from 'react';
import { ExternalLink } from 'react-external-link';
import { Button, FormGroup, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import type { ImageDownloader } from '../../../common/services/ImageDownloader';
import { CopyToClipboardIcon } from '../../../utils/CopyToClipboardIcon';
import type { QrCodeFormat, QrErrorCorrection } from '../../../utils/helpers/qrCodes';
import { buildQrCodeUrl } from '../../../utils/helpers/qrCodes';
import { useFeature } from '../../utils/features';
import type { ShortUrlModalProps } from '../data';
import { QrErrorCorrectionDropdown } from './qr-codes/QrErrorCorrectionDropdown';
import { QrFormatDropdown } from './qr-codes/QrFormatDropdown';
import './QrCodeModal.scss';

export const QrCodeModal = (imageDownloader: ImageDownloader) => (
  { shortUrl: { shortUrl, shortCode }, toggle, isOpen }: ShortUrlModalProps,
) => {
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(0);
  const [format, setFormat] = useState<QrCodeFormat>('png');
  const [errorCorrection, setErrorCorrection] = useState<QrErrorCorrection>('L');
  const displayDownloadBtn = useFeature('nonRestCors');
  const qrCodeUrl = useMemo(
    () => buildQrCodeUrl(shortUrl, { size, format, margin, errorCorrection }),
    [shortUrl, size, format, margin, errorCorrection],
  );
  const totalSize = useMemo(() => size + margin, [size, margin]);
  const modalSize = useMemo(() => {
    if (totalSize < 500) {
      return undefined;
    }

    return totalSize < 800 ? 'lg' : 'xl';
  }, [totalSize]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size={modalSize}>
      <ModalHeader toggle={toggle}>
        QR code for <ExternalLink href={shortUrl}>{shortUrl}</ExternalLink>
      </ModalHeader>
      <ModalBody>
        <Row>
          <FormGroup className="d-grid col-md-6">
            <label>Size: {size}px</label>
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
          <FormGroup className="d-grid col-md-6">
            <label htmlFor="marginControl">Margin: {margin}px</label>
            <input
              id="marginControl"
              type="range"
              className="form-control-range"
              value={margin}
              step={1}
              min={0}
              max={100}
              onChange={(e) => setMargin(Number(e.target.value))}
            />
          </FormGroup>
          <FormGroup className="d-grid col-md-6">
            <QrFormatDropdown format={format} setFormat={setFormat} />
          </FormGroup>
          <FormGroup className="col-md-6">
            <QrErrorCorrectionDropdown errorCorrection={errorCorrection} setErrorCorrection={setErrorCorrection} />
          </FormGroup>
        </Row>
        <div className="text-center">
          <div className="mb-3">
            <ExternalLink href={qrCodeUrl} />
            <CopyToClipboardIcon text={qrCodeUrl} />
          </div>
          <img src={qrCodeUrl} className="qr-code-modal__img" alt="QR code" />
          {displayDownloadBtn && (
            <div className="mt-3">
              <Button
                block
                color="primary"
                onClick={() => {
                  imageDownloader.saveImage(qrCodeUrl, `${shortCode}-qr-code.${format}`).catch(() => {});
                }}
              >
                Download <FontAwesomeIcon icon={downloadIcon} className="ms-1" />
              </Button>
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};
