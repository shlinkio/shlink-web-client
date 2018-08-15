import copyIcon from '@fortawesome/fontawesome-free-regular/faCopy';
import pictureIcon from '@fortawesome/fontawesome-free-regular/faImage';
import tagsIcon from '@fortawesome/fontawesome-free-solid/faTags';
import pieChartIcon from '@fortawesome/fontawesome-free-solid/faChartPie';
import menuIcon from '@fortawesome/fontawesome-free-solid/faEllipsisV';
import qrIcon from '@fortawesome/fontawesome-free-solid/faQrcode';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import PreviewModal from './PreviewModal';
import QrCodeModal from './QrCodeModal';
import './ShortUrlsRowMenu.scss';
import EditTagsModal from './EditTagsModal';

export class ShortUrlsRowMenu extends React.Component {
  state = {
    isOpen: false,
    isQrModalOpen: false,
    isPreviewOpen: false,
    isTagsModalOpen: false,
  };
  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    const { completeShortUrl, onCopyToClipboard, selectedServer, shortUrl } = this.props;
    const serverId = selectedServer ? selectedServer.id : '';
    const toggleQrCode = () => this.setState({isQrModalOpen: !this.state.isQrModalOpen});
    const togglePreview = () => this.setState({isPreviewOpen: !this.state.isPreviewOpen});
    const toggleTags = () => this.setState({isTagsModalOpen: !this.state.isTagsModalOpen});

    return (
      <ButtonDropdown toggle={this.toggle} isOpen={this.state.isOpen} direction="left">
        <DropdownToggle size="sm" caret className="short-urls-row-menu__dropdown-toggle btn-outline-secondary">
          &nbsp;<FontAwesomeIcon icon={menuIcon}/>&nbsp;
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem tag={Link} to={`/server/${serverId}/short-code/${shortUrl.shortCode}/visits`}>
            <FontAwesomeIcon icon={pieChartIcon}/> &nbsp;Visit Stats
          </DropdownItem>
          <DropdownItem onClick={toggleTags}>
            <FontAwesomeIcon icon={tagsIcon}/> &nbsp;Edit tags
          </DropdownItem>
          <EditTagsModal
            url={completeShortUrl}
            shortUrl={shortUrl}
            isOpen={this.state.isTagsModalOpen}
            toggle={toggleTags}
          />

          <DropdownItem divider/>

          <DropdownItem onClick={togglePreview}>
            <FontAwesomeIcon icon={pictureIcon}/> &nbsp;Preview
          </DropdownItem>
          <PreviewModal
            url={completeShortUrl}
            isOpen={this.state.isPreviewOpen}
            toggle={togglePreview}
          />

          <DropdownItem onClick={toggleQrCode}>
            <FontAwesomeIcon icon={qrIcon}/> &nbsp;QR code
          </DropdownItem>
          <QrCodeModal
            url={completeShortUrl}
            isOpen={this.state.isQrModalOpen}
            toggle={toggleQrCode}
          />

          <DropdownItem divider/>

          <CopyToClipboard text={completeShortUrl} onCopy={onCopyToClipboard}>
            <DropdownItem>
              <FontAwesomeIcon icon={copyIcon}/> &nbsp;Copy to clipboard
            </DropdownItem>
          </CopyToClipboard>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}
