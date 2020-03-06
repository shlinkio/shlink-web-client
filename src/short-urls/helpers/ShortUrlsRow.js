import { isEmpty } from 'ramda';
import React from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { ExternalLink } from 'react-external-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy as copyIcon } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { shortUrlsListParamsType } from '../reducers/shortUrlsListParams';
import { serverType } from '../../servers/prop-types';
import { shortUrlType } from '../reducers/shortUrlsList';
import Tag from '../../tags/helpers/Tag';
import ShortUrlVisitsCount from './ShortUrlVisitsCount';
import './ShortUrlsRow.scss';

const ShortUrlsRow = (
  ShortUrlsRowMenu,
  colorGenerator,
  stateFlagTimeout
) => class ShortUrlsRow extends React.Component {
  static propTypes = {
    refreshList: PropTypes.func,
    shortUrlsListParams: shortUrlsListParamsType,
    selectedServer: serverType,
    shortUrl: shortUrlType,
  };

  state = { copiedToClipboard: false };

  renderTags(tags) {
    if (isEmpty(tags)) {
      return <i className="indivisible"><small>No tags</small></i>;
    }

    const { refreshList, shortUrlsListParams } = this.props;
    const selectedTags = shortUrlsListParams.tags || [];

    return tags.map((tag) => (
      <Tag
        colorGenerator={colorGenerator}
        key={tag}
        text={tag}
        onClick={() => refreshList({ tags: [ ...selectedTags, tag ] })}
      />
    ));
  }

  render() {
    const { shortUrl, selectedServer } = this.props;

    return (
      <tr className="short-urls-row">
        <td className="indivisible short-urls-row__cell" data-th="Created at: ">
          <Moment format="YYYY-MM-DD HH:mm">{shortUrl.dateCreated}</Moment>
        </td>
        <td className="short-urls-row__cell" data-th="Short URL: ">
          <span className="indivisible short-urls-row__cell--relative">
            <ExternalLink href={shortUrl.shortUrl} />
            <CopyToClipboard
              text={shortUrl.shortUrl}
              onCopy={() => stateFlagTimeout(this.setState.bind(this), 'copiedToClipboard')}
            >
              <FontAwesomeIcon icon={copyIcon} className="ml-2 short-urls-row__copy-btn" />
            </CopyToClipboard>
            <span
              className="badge badge-warning short-urls-row__copy-hint"
              hidden={!this.state.copiedToClipboard}
            >
              Copied short URL!
            </span>
          </span>
        </td>
        <td className="short-urls-row__cell short-urls-row__cell--break" data-th="Long URL: ">
          <ExternalLink href={shortUrl.longUrl} />
        </td>
        <td className="short-urls-row__cell" data-th="Tags: ">{this.renderTags(shortUrl.tags)}</td>
        <td className="short-urls-row__cell text-md-right" data-th="Visits: ">
          <ShortUrlVisitsCount
            visitsCount={shortUrl.visitsCount}
            shortUrl={shortUrl}
            selectedServer={selectedServer}
          />
        </td>
        <td className="short-urls-row__cell">
          <ShortUrlsRowMenu selectedServer={selectedServer} shortUrl={shortUrl} />
        </td>
      </tr>
    );
  }
};

export default ShortUrlsRow;
