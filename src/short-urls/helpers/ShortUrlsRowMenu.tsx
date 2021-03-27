import {
  faChartPie as pieChartIcon,
  faEllipsisV as menuIcon,
  faQrcode as qrIcon,
  faMinusCircle as deleteIcon,
  faEdit as editIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useToggle } from '../../utils/helpers/hooks';
import { ShortUrl, ShortUrlModalProps } from '../data';
import { SelectedServer } from '../../servers/data';
import ShortUrlDetailLink from './ShortUrlDetailLink';
import './ShortUrlsRowMenu.scss';

export interface ShortUrlsRowMenuProps {
  selectedServer: SelectedServer;
  shortUrl: ShortUrl;
}
type ShortUrlModal = FC<ShortUrlModalProps>;

const ShortUrlsRowMenu = (
  DeleteShortUrlModal: ShortUrlModal,
  QrCodeModal: ShortUrlModal,
) => ({ shortUrl, selectedServer }: ShortUrlsRowMenuProps) => {
  const [ isOpen, toggle ] = useToggle();
  const [ isQrModalOpen, toggleQrCode ] = useToggle();
  const [ isDeleteModalOpen, toggleDelete ] = useToggle();

  return (
    <ButtonDropdown toggle={toggle} isOpen={isOpen}>
      <DropdownToggle size="sm" caret outline className="short-urls-row-menu__dropdown-toggle">
        &nbsp;<FontAwesomeIcon icon={menuIcon} />&nbsp;
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={ShortUrlDetailLink} selectedServer={selectedServer} shortUrl={shortUrl} suffix="visits">
          <FontAwesomeIcon icon={pieChartIcon} fixedWidth /> Visit stats
        </DropdownItem>

        <DropdownItem tag={ShortUrlDetailLink} selectedServer={selectedServer} shortUrl={shortUrl} suffix="edit">
          <FontAwesomeIcon icon={editIcon} fixedWidth /> Edit short URL
        </DropdownItem>

        <DropdownItem onClick={toggleQrCode}>
          <FontAwesomeIcon icon={qrIcon} fixedWidth /> QR code
        </DropdownItem>
        <QrCodeModal shortUrl={shortUrl} isOpen={isQrModalOpen} toggle={toggleQrCode} />

        <DropdownItem divider />

        <DropdownItem className="short-urls-row-menu__dropdown-item--danger" onClick={toggleDelete}>
          <FontAwesomeIcon icon={deleteIcon} fixedWidth /> Delete short URL
        </DropdownItem>
        <DeleteShortUrlModal shortUrl={shortUrl} isOpen={isDeleteModalOpen} toggle={toggleDelete} />
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default ShortUrlsRowMenu;
