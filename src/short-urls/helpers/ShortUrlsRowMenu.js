import { faCopy as copyIcon, faImage as pictureIcon } from '@fortawesome/free-regular-svg-icons';
import {
  faTags as tagsIcon,
  faChartPie as pieChartIcon,
  faEllipsisV as menuIcon,
  faQrcode as qrIcon,
  faMinusCircle as deleteIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import PropTypes from 'prop-types';
import { serverType } from '../../servers/prop-types';
import { shortUrlType } from '../reducers/shortUrlsList';
import PreviewModal from './PreviewModal';
import QrCodeModal from './QrCodeModal';
import './ShortUrlsRowMenu.scss';

const ShortUrlsRowMenu = (DeleteShortUrlModal, EditTagsModal) => class ShortUrlsRowMenu extends React.Component {
  static propTypes = {
    onCopyToClipboard: PropTypes.func,
    selectedServer: serverType,
    shortUrl: shortUrlType,
  };

  state = {
    isOpen: false,
    isQrModalOpen: false,
    isPreviewModalOpen: false,
    isTagsModalOpen: false,
    isDeleteModalOpen: false,
  };
  toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

  render() {
    const { onCopyToClipboard, shortUrl, selectedServer: { id } } = this.props;
    const completeShortUrl = shortUrl && shortUrl.shortUrl ? shortUrl.shortUrl : '';
    const toggleModal = (prop) => () => this.setState((prevState) => ({ [prop]: !prevState[prop] }));
    const toggleQrCode = toggleModal('isQrModalOpen');
    const togglePreview = toggleModal('isPreviewModalOpen');
    const toggleTags = toggleModal('isTagsModalOpen');
    const toggleDelete = toggleModal('isDeleteModalOpen');

    return (
      <ButtonDropdown toggle={this.toggle} isOpen={this.state.isOpen}>
        <DropdownToggle size="sm" caret outline className="short-urls-row-menu__dropdown-toggle">
          &nbsp;<FontAwesomeIcon icon={menuIcon} />&nbsp;
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem tag={Link} to={`/server/${id}/short-code/${shortUrl.shortCode}/visits`}>
            <FontAwesomeIcon icon={pieChartIcon} /> &nbsp;Visit stats
          </DropdownItem>

          <DropdownItem onClick={toggleTags}>
            <FontAwesomeIcon icon={tagsIcon} /> &nbsp;Edit tags
          </DropdownItem>
          <EditTagsModal
            url={completeShortUrl}
            shortUrl={shortUrl}
            isOpen={this.state.isTagsModalOpen}
            toggle={toggleTags}
          />

          <DropdownItem className="short-urls-row-menu__dropdown-item--danger" onClick={toggleDelete}>
            <FontAwesomeIcon icon={deleteIcon} /> &nbsp;Delete short URL
          </DropdownItem>
          <DeleteShortUrlModal shortUrl={shortUrl} isOpen={this.state.isDeleteModalOpen} toggle={toggleDelete} />

          <DropdownItem divider />

          <DropdownItem onClick={togglePreview}>
            <FontAwesomeIcon icon={pictureIcon} /> &nbsp;Preview
          </DropdownItem>
          <PreviewModal url={completeShortUrl} isOpen={this.state.isPreviewModalOpen} toggle={togglePreview} />

          <DropdownItem onClick={toggleQrCode}>
            <FontAwesomeIcon icon={qrIcon} /> &nbsp;QR code
          </DropdownItem>
          <QrCodeModal url={completeShortUrl} isOpen={this.state.isQrModalOpen} toggle={toggleQrCode} />

          <DropdownItem divider />

          <CopyToClipboard text={completeShortUrl} onCopy={onCopyToClipboard}>
            <DropdownItem>
              <FontAwesomeIcon icon={copyIcon} /> &nbsp;Copy to clipboard
            </DropdownItem>
          </CopyToClipboard>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
};

export default ShortUrlsRowMenu;
