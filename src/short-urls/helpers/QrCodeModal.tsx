import { FC, useMemo, useState } from 'react';
import { Modal, DropdownItem, FormGroup, ModalBody, ModalHeader, Row, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload as downloadIcon } from '@fortawesome/free-solid-svg-icons';
import { ExternalLink } from 'react-external-link';
import classNames from 'classnames';
import { ShortUrlModalProps } from '../data';
import { SelectedServer } from '../../servers/data';
import { DropdownBtn } from '../../utils/DropdownBtn';
import { CopyToClipboardIcon } from '../../utils/CopyToClipboardIcon';
import { buildQrCodeUrl, QrCodeCapabilities, QrCodeFormat } from '../../utils/helpers/qrCodes';
import { supportsQrCodeSizeInQuery, supportsQrCodeSvgFormat, supportsQrCodeMargin } from '../../utils/helpers/features';
import { ImageDownloader } from '../../common/services/ImageDownloader';
import { Versions } from '../../utils/helpers/version';
import './QrCodeModal.scss';

interface QrCodeModalConnectProps extends ShortUrlModalProps {
  selectedServer: SelectedServer;
}

const QrCodeModal = (imageDownloader: ImageDownloader, ForServerVersion: FC<Versions>) => (
  { shortUrl: { shortUrl, shortCode }, toggle, isOpen, selectedServer }: QrCodeModalConnectProps,
) => {
  const [ size, setSize ] = useState(300);
  const [ margin, setMargin ] = useState(0);
  const [ format, setFormat ] = useState<QrCodeFormat>('png');
  const capabilities: QrCodeCapabilities = useMemo(() => ({
    useSizeInPath: !supportsQrCodeSizeInQuery(selectedServer),
    svgIsSupported: supportsQrCodeSvgFormat(selectedServer),
    marginIsSupported: supportsQrCodeMargin(selectedServer),
  }), [ selectedServer ]);
  const qrCodeUrl = useMemo(
    () => buildQrCodeUrl(shortUrl, { size, format, margin }, capabilities),
    [ shortUrl, size, format, margin, capabilities ],
  );
  const totalSize = useMemo(() => size + margin, [ size, margin ]);
  const modalSize = useMemo(() => {
    if (totalSize < 500) {
      return undefined;
    }

    return totalSize < 800 ? 'lg' : 'xl';
  }, [ totalSize ]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size={modalSize}>
      <ModalHeader toggle={toggle}>
        QR code for <ExternalLink href={shortUrl}>{shortUrl}</ExternalLink>
      </ModalHeader>
      <ModalBody>
        <Row className="mb-2">
          <div
            className={classNames({
              'col-md-4': capabilities.marginIsSupported && capabilities.svgIsSupported,
              'col-md-6': (!capabilities.marginIsSupported && capabilities.svgIsSupported) || (capabilities.marginIsSupported && !capabilities.svgIsSupported),
              'col-12': !capabilities.marginIsSupported && !capabilities.svgIsSupported,
            })}
          >
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
          {capabilities.marginIsSupported && (
            <div className={capabilities.svgIsSupported ? 'col-md-4' : 'col-md-6'}>
              <FormGroup>
                <label className="mb-0">Margin: {margin}px</label>
                <input
                  type="range"
                  className="form-control-range"
                  value={margin}
                  step={1}
                  min={0}
                  max={100}
                  onChange={(e) => setMargin(Number(e.target.value))}
                />
              </FormGroup>
            </div>
          )}
          {capabilities.svgIsSupported && (
            <div className={capabilities.marginIsSupported ? 'col-md-4' : 'col-md-6'}>
              <DropdownBtn text={`Format (${format})`}>
                <DropdownItem active={format === 'png'} onClick={() => setFormat('png')}>PNG</DropdownItem>
                <DropdownItem active={format === 'svg'} onClick={() => setFormat('svg')}>SVG</DropdownItem>
              </DropdownBtn>
            </div>
          )}
        </Row>
        <div className="text-center">
          <div className="mb-3">
            <ExternalLink href={qrCodeUrl} />
            <CopyToClipboardIcon text={qrCodeUrl} />
          </div>
          <img src={qrCodeUrl} className="qr-code-modal__img" alt="QR code" />
          <ForServerVersion minVersion="2.9.0">
            <div className="mt-3">
              <Button
                block
                color="primary"
                onClick={async () => imageDownloader.saveImage(qrCodeUrl, `${shortCode}-qr-code.${format}`)}
              >
                Download <FontAwesomeIcon icon={downloadIcon} className="ml-1" />
              </Button>
            </div>
          </ForServerVersion>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default QrCodeModal;
