import {
  faTags as tagsIcon,
  faChartPie as pieChartIcon,
  faEllipsisV as menuIcon,
  faQrcode as qrIcon,
  faMinusCircle as deleteIcon,
  faEdit as editIcon,
  faLink as linkIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useToggle } from '../../utils/helpers/hooks';
import { ShortUrl, ShortUrlModalProps } from '../data';
import { Versions } from '../../utils/helpers/version';
import { SelectedServer } from '../../servers/data';
import QrCodeModal from './QrCodeModal';
import VisitStatsLink from './VisitStatsLink';
import './ShortUrlsRowMenu.scss';

export interface ShortUrlsRowMenuProps {
  selectedServer: SelectedServer;
  shortUrl: ShortUrl;
}
type ShortUrlModal = FC<ShortUrlModalProps>;

const ShortUrlsRowMenu = (
  DeleteShortUrlModal: ShortUrlModal,
  EditTagsModal: ShortUrlModal,
  EditMetaModal: ShortUrlModal,
  EditShortUrlModal: ShortUrlModal,
  ForServerVersion: FC<Versions>,
) => ({ shortUrl, selectedServer }: ShortUrlsRowMenuProps) => {
  const [ isOpen, toggle ] = useToggle();
  const [ isQrModalOpen, toggleQrCode ] = useToggle();
  const [ isTagsModalOpen, toggleTags ] = useToggle();
  const [ isMetaModalOpen, toggleMeta ] = useToggle();
  const [ isDeleteModalOpen, toggleDelete ] = useToggle();
  const [ isEditModalOpen, toggleEdit ] = useToggle();

  return (
    <ButtonDropdown toggle={toggle} isOpen={isOpen}>
      <DropdownToggle size="sm" caret outline className="short-urls-row-menu__dropdown-toggle">
        &nbsp;<FontAwesomeIcon icon={menuIcon} />&nbsp;
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem tag={VisitStatsLink} selectedServer={selectedServer} shortUrl={shortUrl}>
          <FontAwesomeIcon icon={pieChartIcon} fixedWidth /> Visit stats
        </DropdownItem>

        <DropdownItem onClick={toggleTags}>
          <FontAwesomeIcon icon={tagsIcon} fixedWidth /> Edit tags
        </DropdownItem>
        <EditTagsModal shortUrl={shortUrl} isOpen={isTagsModalOpen} toggle={toggleTags} />

        <DropdownItem onClick={toggleMeta}>
          <FontAwesomeIcon icon={editIcon} fixedWidth /> Edit metadata
        </DropdownItem>
        <EditMetaModal shortUrl={shortUrl} isOpen={isMetaModalOpen} toggle={toggleMeta} />

        <ForServerVersion minVersion="2.1.0">
          <DropdownItem onClick={toggleEdit}>
            <FontAwesomeIcon icon={linkIcon} fixedWidth /> Edit long URL
          </DropdownItem>
          <EditShortUrlModal shortUrl={shortUrl} isOpen={isEditModalOpen} toggle={toggleEdit} />
        </ForServerVersion>

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
