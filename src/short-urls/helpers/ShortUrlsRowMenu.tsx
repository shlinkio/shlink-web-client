import {
  faChartPie as pieChartIcon,
  faQrcode as qrIcon,
  faMinusCircle as deleteIcon,
  faEdit as editIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { DropdownItem } from 'reactstrap';
import { useToggle } from '../../utils/helpers/hooks';
import { ShortUrl, ShortUrlModalProps } from '../data';
import { SelectedServer } from '../../servers/data';
import { DropdownBtnMenu } from '../../utils/DropdownBtnMenu';
import { ShortUrlDetailLink } from './ShortUrlDetailLink';

export interface ShortUrlsRowMenuProps {
  selectedServer: SelectedServer;
  shortUrl: ShortUrl;
}
type ShortUrlModal = FC<ShortUrlModalProps>;

export const ShortUrlsRowMenu = (
  DeleteShortUrlModal: ShortUrlModal,
  QrCodeModal: ShortUrlModal,
) => ({ shortUrl, selectedServer }: ShortUrlsRowMenuProps) => {
  const [isOpen, toggle] = useToggle();
  const [isQrModalOpen,, openQrCodeModal, closeQrCodeModal] = useToggle();
  const [isDeleteModalOpen,, openDeleteModal, closeDeleteModal] = useToggle();

  return (
    <DropdownBtnMenu toggle={toggle} isOpen={isOpen}>
      <DropdownItem tag={ShortUrlDetailLink} selectedServer={selectedServer} shortUrl={shortUrl} suffix="visits">
        <FontAwesomeIcon icon={pieChartIcon} fixedWidth /> Visit stats
      </DropdownItem>

      <DropdownItem tag={ShortUrlDetailLink} selectedServer={selectedServer} shortUrl={shortUrl} suffix="edit">
        <FontAwesomeIcon icon={editIcon} fixedWidth /> Edit short URL
      </DropdownItem>

      <DropdownItem onClick={openQrCodeModal}>
        <FontAwesomeIcon icon={qrIcon} fixedWidth /> QR code
      </DropdownItem>
      <QrCodeModal shortUrl={shortUrl} isOpen={isQrModalOpen} toggle={closeQrCodeModal} />

      <DropdownItem divider />

      <DropdownItem className="dropdown-item--danger" onClick={openDeleteModal}>
        <FontAwesomeIcon icon={deleteIcon} fixedWidth /> Delete short URL
      </DropdownItem>
      <DeleteShortUrlModal shortUrl={shortUrl} isOpen={isDeleteModalOpen} toggle={closeDeleteModal} />
    </DropdownBtnMenu>
  );
};
