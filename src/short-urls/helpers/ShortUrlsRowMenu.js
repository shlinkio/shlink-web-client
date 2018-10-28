import copyIcon from '@fortawesome/fontawesome-free-regular/faCopy';
import pictureIcon from '@fortawesome/fontawesome-free-regular/faImage';
import tagsIcon from '@fortawesome/fontawesome-free-solid/faTags';
import pieChartIcon from '@fortawesome/fontawesome-free-solid/faChartPie';
import menuIcon from '@fortawesome/fontawesome-free-solid/faEllipsisV';
import qrIcon from '@fortawesome/fontawesome-free-solid/faQrcode';
import deleteIcon from '@fortawesome/fontawesome-free-solid/faMinusCircle';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import PropTypes from 'prop-types';
import { serverType } from '../../servers/prop-types';
import { shortUrlType } from '../reducers/shortUrlsList';
import PreviewModal from './PreviewModal';
import QrCodeModal from './QrCodeModal';
import EditTagsModal from './EditTagsModal';
import DeleteShortUrlModal from './DeleteShortUrlModal';
import './ShortUrlsRowMenu.scss';

export class ShortUrlsRowMenu extends React.Component {
  static propTypes = {
    completeShortUrl: PropTypes.string,
    onCopyToClipboard: PropTypes.func,
    selectedServer: serverType,
    shortUrl: shortUrlType,
  };

  state = {
    isOpen: false,
    isQrModalOpen: false,
    isPreviewOpen: false,
    isTagsModalOpen: false,
    isDeleteModalOpen: false,
  };
  toggle = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

  render() {
    const { completeShortUrl, onCopyToClipboard, selectedServer, shortUrl } = this.props;
    const serverId = selectedServer ? selectedServer.id : '';
    const toggleModal = (prop) => () => this.setState((prevState) => ({ [prop]: !prevState[prop] }));
    const toggleQrCode = toggleModal('isQrModalOpen');
    const togglePreview = toggleModal('isPreviewOpen');
    const toggleTags = toggleModal('isTagsModalOpen');
    const toggleDelete = toggleModal('isDeleteModalOpen');

    return (
      <ButtonDropdown toggle={this.toggle} isOpen={this.state.isOpen}>
        <DropdownToggle size="sm" caret className="short-urls-row-menu__dropdown-toggle btn-outline-secondary">
          &nbsp;<FontAwesomeIcon icon={menuIcon} />&nbsp;
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem tag={Link} to={`/server/${serverId}/short-code/${shortUrl.shortCode}/visits`}>
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
          <DeleteShortUrlModal
            shortUrl={shortUrl}
            isOpen={this.state.isDeleteModalOpen}
            toggle={toggleDelete}
          />

          <DropdownItem divider />

          <DropdownItem onClick={togglePreview}>
            <FontAwesomeIcon icon={pictureIcon} /> &nbsp;Preview
          </DropdownItem>
          <PreviewModal
            url={completeShortUrl}
            isOpen={this.state.isPreviewOpen}
            toggle={togglePreview}
          />

          <DropdownItem onClick={toggleQrCode}>
            <FontAwesomeIcon icon={qrIcon} /> &nbsp;QR code
          </DropdownItem>
          <QrCodeModal
            url={completeShortUrl}
            isOpen={this.state.isQrModalOpen}
            toggle={toggleQrCode}
          />

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
}
