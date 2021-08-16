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
import { buildQrCodeUrl, QrCodeCapabilities, QrCodeFormat, QrErrorCorrection } from '../../utils/helpers/qrCodes';
import {
  supportsQrCodeSizeInQuery,
  supportsQrCodeSvgFormat,
  supportsQrCodeMargin,
  supportsQrErrorCorrection,
} from '../../utils/helpers/features';
import { ImageDownloader } from '../../common/services/ImageDownloader';
import { Versions } from '../../utils/helpers/version';
import './QrCodeModal.scss';

interface QrCodeModalConnectProps extends ShortUrlModalProps {
  selectedServer: SelectedServer;
}

const QrCodeModal = (imageDownloader: ImageDownloader, ForServerVersion: FC<Versions>) => ( // eslint-disable-line
  { shortUrl: { shortUrl, shortCode }, toggle, isOpen, selectedServer }: QrCodeModalConnectProps,
) => {
  const [ size, setSize ] = useState(300);
  const [ margin, setMargin ] = useState(0);
  const [ format, setFormat ] = useState<QrCodeFormat>('png');
  const [ errorCorrection, setErrorCorrection ] = useState<QrErrorCorrection>('L');
  const capabilities: QrCodeCapabilities = useMemo(() => ({
    useSizeInPath: !supportsQrCodeSizeInQuery(selectedServer),
    svgIsSupported: supportsQrCodeSvgFormat(selectedServer),
    marginIsSupported: supportsQrCodeMargin(selectedServer),
    errorCorrectionIsSupported: supportsQrErrorCorrection(selectedServer),
  }) as QrCodeCapabilities, [ selectedServer ]);
  const qrCodeUrl = useMemo(
    () => buildQrCodeUrl(shortUrl, { size, format, margin, errorCorrection }, capabilities),
    [ shortUrl, size, format, margin, errorCorrection, capabilities ],
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
        <Row>
          <FormGroup
            className={classNames({
              'col-md-4': capabilities.marginIsSupported && capabilities.svgIsSupported && !capabilities.errorCorrectionIsSupported,
              'col-md-6': capabilities.errorCorrectionIsSupported || (!capabilities.marginIsSupported && capabilities.svgIsSupported) || (capabilities.marginIsSupported && !capabilities.svgIsSupported),
              'col-12': !capabilities.marginIsSupported && !capabilities.svgIsSupported && !capabilities.errorCorrectionIsSupported,
            })}
          >
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
          {capabilities.marginIsSupported && (
            <FormGroup className={capabilities.svgIsSupported && !capabilities.errorCorrectionIsSupported ? 'col-md-4' : 'col-md-6'}>
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
          )}
          {capabilities.svgIsSupported && (
            <FormGroup className={capabilities.marginIsSupported && !capabilities.errorCorrectionIsSupported ? 'col-md-4' : 'col-md-6'}>
              <DropdownBtn text={`Format (${format})`}>
                <DropdownItem active={format === 'png'} onClick={() => setFormat('png')}>PNG</DropdownItem>
                <DropdownItem active={format === 'svg'} onClick={() => setFormat('svg')}>SVG</DropdownItem>
              </DropdownBtn>
            </FormGroup>
          )}
          {capabilities.errorCorrectionIsSupported && (
            <FormGroup className="col-md-6">
              <DropdownBtn text={`Error correction (${errorCorrection})`}>
                <DropdownItem active={errorCorrection === 'L'} onClick={() => setErrorCorrection('L')}>
                  <b>L</b>ow
                </DropdownItem>
                <DropdownItem active={errorCorrection === 'M'} onClick={() => setErrorCorrection('M')}>
                  <b>M</b>edium
                </DropdownItem>
                <DropdownItem active={errorCorrection === 'Q'} onClick={() => setErrorCorrection('Q')}>
                  <b>Q</b>uartile
                </DropdownItem>
                <DropdownItem active={errorCorrection === 'H'} onClick={() => setErrorCorrection('H')}>
                  <b>H</b>igh
                </DropdownItem>
              </DropdownBtn>
            </FormGroup>
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
