import { isEmpty } from 'ramda';
import React from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { shortUrlsListParamsType } from '../reducers/shortUrlsListParams';
import { serverType } from '../../servers/prop-types';
import ExternalLink from '../../utils/ExternalLink';
import { shortUrlType } from '../reducers/shortUrlsList';
import { stateFlagTimeout } from '../../utils/utils';
import './ShortUrlsRow.scss';

const ShortUrlsRow = (Tag, ShortUrlsRowMenu) => class ShortUrlsRow extends React.Component {
  static propTypes = {
    refreshList: PropTypes.func,
    shortUrlsListParams: shortUrlsListParamsType,
    selectedServer: serverType,
    shortUrl: shortUrlType,
  };

  state = { copiedToClipboard: false };

  renderTags(tags) {
    if (isEmpty(tags)) {
      return <i className="nowrap"><small>No tags</small></i>;
    }

    const { refreshList, shortUrlsListParams } = this.props;
    const selectedTags = shortUrlsListParams.tags || [];

    return tags.map((tag) => (
      <Tag
        key={tag}
        text={tag}
        onClick={() => refreshList({ tags: [ ...selectedTags, tag ] })}
      />
    ));
  }

  render() {
    const { shortUrl, selectedServer } = this.props;
    const completeShortUrl = !selectedServer ? shortUrl.shortCode : `${selectedServer.url}/${shortUrl.shortCode}`;

    return (
      <tr className="short-urls-row">
        <td className="nowrap short-urls-row__cell" data-th="Created at: ">
          <Moment format="YYYY-MM-DD HH:mm">{shortUrl.dateCreated}</Moment>
        </td>
        <td className="short-urls-row__cell" data-th="Short URL: ">
          <ExternalLink href={completeShortUrl}>{completeShortUrl}</ExternalLink>
        </td>
        <td className="short-urls-row__cell short-urls-row__cell--break" data-th="Long URL: ">
          <ExternalLink href={shortUrl.originalUrl}>{shortUrl.originalUrl}</ExternalLink>
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
            completeShortUrl={completeShortUrl}
            selectedServer={selectedServer}
            shortUrl={shortUrl}
            onCopyToClipboard={() => stateFlagTimeout(this.setState.bind(this), 'copiedToClipboard')}
          />
        </td>
      </tr>
    );
  }
};

export default ShortUrlsRow;
