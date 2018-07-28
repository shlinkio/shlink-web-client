import React from 'react';
import Moment from 'react-moment';
import { ShortUrlsList } from '../ShortUrlsList';
import { RowMenu } from './ShortUrlsRowMenu';
import './ShortUrlsRow.scss'

export class Row extends React.Component {
  state = {displayMenu: false, copiedToClipboard: false};

  render() {
    const {shortUrl, selectedServer} = this.props;
    const completeShortUrl = !selectedServer ? shortUrl.shortCode : `${selectedServer.url}/${shortUrl.shortCode}`;

    return (
      <tr
        onMouseEnter={() => this.setState({displayMenu: true})}
        onMouseLeave={() => this.setState({displayMenu: false})}
      >
        <td className="nowrap short-urls-row__cell">
          <Moment format="YYYY-MM-DD HH:mm" interval={0}>{shortUrl.dateCreated}</Moment>
        </td>
        <td className="short-urls-row__cell">
          <a href={completeShortUrl} target="_blank">{completeShortUrl}</a>
        </td>
        <td className="short-urls-row__cell short-urls-row__cell--relative">
          <a href={shortUrl.originalUrl} target="_blank">{shortUrl.originalUrl}</a>
          <small
            className="badge badge-warning short-urls-row__copy-hint"
            hidden={!this.state.copiedToClipboard}
          >
            Copied short URL!
          </small>
        </td>
        <td className="short-urls-row__cell">{ShortUrlsList.renderTags(shortUrl.tags)}</td>
        <td className="short-urls-row__cell text-right">{shortUrl.visitsCount}</td>
        <td className="short-urls-row__cell">
          <RowMenu
            display={this.state.displayMenu}
            shortUrl={completeShortUrl}
            onCopyToClipboard={() => {
              this.setState({copiedToClipboard: true});
              setTimeout(() => this.setState({copiedToClipboard: false}), 2000);
            }}
          />
        </td>
      </tr>
    );
  }
}
