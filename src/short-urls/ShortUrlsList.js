import React from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { isEmpty } from 'ramda';
import pieChartIcon from '@fortawesome/fontawesome-free-solid/faChartPie';
import pictureIcon from '@fortawesome/fontawesome-free-solid/faImage';
import qrIcon from '@fortawesome/fontawesome-free-solid/faQrcode';
import copyIcon from '@fortawesome/fontawesome-free-solid/faCopy';
import menuIcon from '@fortawesome/fontawesome-free-solid/faEllipsisV';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Tag from '../utils/Tag';
import { listShortUrls } from './reducers/shortUrlsList';
import './ShortUrlsList.scss';

export class ShortUrlsList extends React.Component {
  componentDidMount() {
    const { match: { params } } = this.props;
    this.props.listShortUrls(params.serverId, {
      ...this.props.shortUrlsListParams,
      page: params.page
    });
  }

  render() {
    return (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Created at</th>
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Tags</th>
            <th>Visits</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {this.renderShortUrls()}
        </tbody>
      </table>
    );
  }

  renderShortUrls() {
    const { shortUrlsList, selectedServer, loading } = this.props;
    if (loading) {
      return <tr><td colSpan="6" className="text-center">Loading...</td></tr>;
    }

    if (! loading && isEmpty(shortUrlsList)) {
      return <tr><td colSpan="6" className="text-center">No results found</td></tr>;
    }

    return shortUrlsList.map(shortUrl => (
      <Row shortUrl={shortUrl} selectedServer={selectedServer} key={shortUrl.shortCode} />
    ));
  }

  static renderTags(tags) {
    if (isEmpty(tags)) {
      return <i className="nowrap"><small>No tags</small></i>;
    }

    return tags.map(tag => <Tag text={tag} />);
  }
}

class Row extends React.Component {
  state = { displayMenu: false };

  render() {
    const { shortUrl, selectedServer } = this.props;

    return (
      <tr
        onMouseEnter={() => this.setState({ displayMenu: true })}
        onMouseLeave={() => this.setState({ displayMenu: false })}
      >
        <td className="nowrap short-urls-list__cell">
          <Moment format="YYYY-MM-DD HH:mm" interval={0}>{shortUrl.dateCreated}</Moment>
        </td>
        <td className="short-urls-list__cell">
          <a href={`${selectedServer.url}/${shortUrl.shortCode}`} target="_blank">
            {`${selectedServer.url}/${shortUrl.shortCode}`}
          </a>
        </td>
        <td className="short-urls-list__cell">
          <a href={shortUrl.originalUrl} target="_blank">{shortUrl.originalUrl}</a>
        </td>
        <td className="short-urls-list__cell">{ShortUrlsList.renderTags(shortUrl.tags)}</td>
        <td className="short-urls-list__cell text-right">{shortUrl.visitsCount}</td>
        <td className="short-urls-list__cell">
          <RowMenu display={this.state.displayMenu} />
        </td>
      </tr>
    )
  }
}

class RowMenu extends React.Component {
  state = { isOpen: false };
  toggle = () => this.setState({ isOpen: ! this.state.isOpen });

  render () {
    const determineClass = () => {
      const baseClass = 'short-urls-list__dropdown-toggle';
      return ! this.props.display ? `${baseClass} short-urls-list__dropdown-toggle--hidden` : baseClass;
    };

    return (
      <ButtonDropdown toggle={this.toggle} isOpen={this.state.isOpen} direction="left">
        <DropdownToggle color="white" size="sm" caret className={determineClass()}>
          &nbsp;<FontAwesomeIcon icon={menuIcon} />&nbsp;
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <FontAwesomeIcon icon={pieChartIcon} /> &nbsp;Visit Stats
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            <FontAwesomeIcon icon={pictureIcon} /> &nbsp;Preview
          </DropdownItem>
          <DropdownItem>
            <FontAwesomeIcon icon={qrIcon} /> &nbsp;QR code
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem>
            <FontAwesomeIcon icon={copyIcon} /> &nbsp;Copy to clipboard
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

export default connect(state => ({
  selectedServer: state.selectedServer,
  shortUrlsListParams: state.shortUrlsListParams,
}), { listShortUrls })(ShortUrlsList);
