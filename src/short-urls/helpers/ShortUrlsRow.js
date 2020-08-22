import { isEmpty } from 'ramda';
import React, { useEffect, useRef } from 'react';
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

const propTypes = {
  refreshList: PropTypes.func,
  shortUrlsListParams: shortUrlsListParamsType,
  selectedServer: serverType,
  shortUrl: shortUrlType,
};

const ShortUrlsRow = (
  ShortUrlsRowMenu,
  colorGenerator,
  useStateFlagTimeout,
) => {
  const ShortUrlsRowComp = ({ shortUrl, selectedServer, refreshList, shortUrlsListParams }) => {
    const [ copiedToClipboard, setCopiedToClipboard ] = useStateFlagTimeout();
    const [ active, setActive ] = useStateFlagTimeout(false, 500);
    const isFirstRun = useRef(true);

    const renderTags = (tags) => {
      if (isEmpty(tags)) {
        return <i className="indivisible"><small>No tags</small></i>;
      }

      const selectedTags = shortUrlsListParams.tags || [];

      return tags.map((tag) => (
        <Tag
          colorGenerator={colorGenerator}
          key={tag}
          text={tag}
          onClick={() => refreshList({ tags: [ ...selectedTags, tag ] })}
        />
      ));
    };

    useEffect(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
      } else {
        setActive(true);
      }
    }, [ shortUrl.visitsCount ]);

    return (
      <tr className="short-urls-row">
        <td className="indivisible short-urls-row__cell" data-th="Created at: ">
          <Moment format="YYYY-MM-DD HH:mm">{shortUrl.dateCreated}</Moment>
        </td>
        <td className="short-urls-row__cell" data-th="Short URL: ">
          <span className="indivisible short-urls-row__cell--relative">
            <ExternalLink href={shortUrl.shortUrl} />
            <CopyToClipboard text={shortUrl.shortUrl} onCopy={setCopiedToClipboard}>
              <FontAwesomeIcon icon={copyIcon} className="ml-2 short-urls-row__copy-btn" />
            </CopyToClipboard>
            <span className="badge badge-warning short-urls-row__copy-hint" hidden={!copiedToClipboard}>
              Copied short URL!
            </span>
          </span>
        </td>
        <td className="short-urls-row__cell short-urls-row__cell--break" data-th="Long URL: ">
          <ExternalLink href={shortUrl.longUrl} />
        </td>
        <td className="short-urls-row__cell" data-th="Tags: ">{renderTags(shortUrl.tags)}</td>
        <td className="short-urls-row__cell text-md-right" data-th="Visits: ">
          <ShortUrlVisitsCount
            visitsCount={shortUrl.visitsCount}
            shortUrl={shortUrl}
            selectedServer={selectedServer}
            active={active}
          />
        </td>
        <td className="short-urls-row__cell">
          <ShortUrlsRowMenu selectedServer={selectedServer} shortUrl={shortUrl} />
        </td>
      </tr>
    );
  };

  ShortUrlsRowComp.propTypes = propTypes;

  return ShortUrlsRowComp;
};

export default ShortUrlsRow;
