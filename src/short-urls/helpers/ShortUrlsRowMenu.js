import { faImage as pictureIcon } from '@fortawesome/free-regular-svg-icons';
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
import React from 'react';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { serverType } from '../../servers/prop-types';
import { shortUrlType } from '../reducers/shortUrlsList';
import { useToggle } from '../../utils/helpers/hooks';
import PreviewModal from './PreviewModal';
import QrCodeModal from './QrCodeModal';
import VisitStatsLink from './VisitStatsLink';
import './ShortUrlsRowMenu.scss';

const propTypes = {
  selectedServer: serverType,
  shortUrl: shortUrlType,
};

const ShortUrlsRowMenu = (DeleteShortUrlModal, EditTagsModal, EditMetaModal, EditShortUrlModal, ForServerVersion) => {
  const ShortUrlsRowMenuComp = ({ shortUrl, selectedServer }) => {
    const [ isOpen, toggle ] = useToggle(false);
    const [ isQrModalOpen, toggleQrCode ] = useToggle(false);
    const [ isPreviewModalOpen, togglePreview ] = useToggle(false);
    const [ isTagsModalOpen, toggleTags ] = useToggle(false);
    const [ isMetaModalOpen, toggleMeta ] = useToggle(false);
    const [ isDeleteModalOpen, toggleDelete ] = useToggle(false);
    const [ isEditModalOpen, toggleEdit ] = useToggle(false);
    const completeShortUrl = shortUrl && shortUrl.shortUrl ? shortUrl.shortUrl : '';

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

          <ForServerVersion minVersion="1.18.0">
            <DropdownItem onClick={toggleMeta}>
              <FontAwesomeIcon icon={editIcon} fixedWidth /> Edit metadata
            </DropdownItem>
            <EditMetaModal shortUrl={shortUrl} isOpen={isMetaModalOpen} toggle={toggleMeta} />
          </ForServerVersion>

          <ForServerVersion minVersion="2.1.0">
            <DropdownItem onClick={toggleEdit}>
              <FontAwesomeIcon icon={linkIcon} fixedWidth /> Edit long URL
            </DropdownItem>
            <EditShortUrlModal shortUrl={shortUrl} isOpen={isEditModalOpen} toggle={toggleEdit} />
          </ForServerVersion>

          <DropdownItem onClick={toggleQrCode}>
            <FontAwesomeIcon icon={qrIcon} fixedWidth /> QR code
          </DropdownItem>
          <QrCodeModal url={completeShortUrl} isOpen={isQrModalOpen} toggle={toggleQrCode} />

          <ForServerVersion maxVersion="1.x">
            <DropdownItem onClick={togglePreview}>
              <FontAwesomeIcon icon={pictureIcon} fixedWidth /> Preview
            </DropdownItem>
            <PreviewModal url={completeShortUrl} isOpen={isPreviewModalOpen} toggle={togglePreview} />
          </ForServerVersion>

          <DropdownItem divider />

          <DropdownItem className="short-urls-row-menu__dropdown-item--danger" onClick={toggleDelete}>
            <FontAwesomeIcon icon={deleteIcon} fixedWidth /> Delete short URL
          </DropdownItem>
          <DeleteShortUrlModal shortUrl={shortUrl} isOpen={isDeleteModalOpen} toggle={toggleDelete} />
        </DropdownMenu>
      </ButtonDropdown>
    );
  };

  ShortUrlsRowMenuComp.propTypes = propTypes;

  return ShortUrlsRowMenuComp;
};

export default ShortUrlsRowMenu;
