import { isEmpty } from 'ramda';
import React from 'react';
import Moment from 'react-moment';
import Tag from '../../utils/Tag';
import './ShortUrlsRow.scss';
import { ShortUrlsRowMenu } from './ShortUrlsRowMenu';

export class ShortUrlsRow extends React.Component {
  state = { displayMenu: false, copiedToClipboard: false };

  renderTags(tags) {
    if (isEmpty(tags)) {
      return <i className="nowrap"><small>No tags</small></i>;
    }

    const { refreshList, shortUrlsListParams } = this.props;
    const selectedTags = shortUrlsListParams.tags || [];
    return tags.map(
      tag => <Tag key={tag} text={tag} onClick={() => refreshList({tags: [ ...selectedTags, tag ] })} />
    );
  }

  render() {
    const { shortUrl, selectedServer } = this.props;
    const completeShortUrl = !selectedServer ? shortUrl.shortCode : `${selectedServer.url}/${shortUrl.shortCode}`;

    return (
      <tr
        className="short-urls-row"
        onMouseEnter={() => this.setState({displayMenu: true})}
        onMouseLeave={() => this.setState({displayMenu: false})}
      >
        <td className="nowrap short-urls-row__cell" data-th="Created at: ">
          <Moment format="YYYY-MM-DD HH:mm">{shortUrl.dateCreated}</Moment>
        </td>
        <td className="short-urls-row__cell" data-th="Short URL: ">
          <a href={completeShortUrl} target="_blank">{completeShortUrl}</a>
        </td>
        <td className="short-urls-row__cell short-urls-row__cell--break" data-th="Long URL: ">
          <a href={shortUrl.originalUrl} target="_blank">{shortUrl.originalUrl}</a>
        </td>
        <td className="short-urls-row__cell" data-th="Tags: ">{this.renderTags(shortUrl.tags)}</td>
        <td className="short-urls-row__cell text-md-right" data-th="Visits: ">{shortUrl.visitsCount}</td>
        <td className="short-urls-row__cell short-urls-row__cell--relative">
          <small
            className="badge badge-warning short-urls-row__copy-hint"
            hidden={!this.state.copiedToClipboard}
          >
            Copied short URL!
          </small>
          <ShortUrlsRowMenu
            display={this.state.displayMenu}
            shortUrl={completeShortUrl}
            selectedServer={selectedServer}
            shortCode={shortUrl.shortCode}
            onCopyToClipboard={() => {
              this.setState({ copiedToClipboard: true });
              setTimeout(() => this.setState({ copiedToClipboard: false }), 2000);
            }}
          />
        </td>
      </tr>
    );
  }
}
