import { isEmpty } from 'ramda';
import React, { FC, useEffect, useRef } from 'react';
import Moment from 'react-moment';
import { ExternalLink } from 'react-external-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy as copyIcon } from '@fortawesome/free-regular-svg-icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ShortUrlsListParams } from '../reducers/shortUrlsListParams';
import ColorGenerator from '../../utils/services/ColorGenerator';
import { StateFlagTimeout } from '../../utils/helpers/hooks';
import Tag from '../../tags/helpers/Tag';
import { SelectedServer } from '../../servers/data';
import { ShortUrl } from '../data';
import ShortUrlVisitsCount from './ShortUrlVisitsCount';
import { ShortUrlsRowMenuProps } from './ShortUrlsRowMenu';
import './ShortUrlsRow.scss';

export interface ShortUrlsRowProps {
  refreshList: Function;
  shortUrlsListParams: ShortUrlsListParams;
  selectedServer: SelectedServer;
  shortUrl: ShortUrl;
}

const ShortUrlsRow = (
  ShortUrlsRowMenu: FC<ShortUrlsRowMenuProps>,
  colorGenerator: ColorGenerator,
  useStateFlagTimeout: StateFlagTimeout,
) => ({ shortUrl, selectedServer, refreshList, shortUrlsListParams }: ShortUrlsRowProps) => {
  const [ copiedToClipboard, setCopiedToClipboard ] = useStateFlagTimeout();
  const [ active, setActive ] = useStateFlagTimeout(false, 500);
  const isFirstRun = useRef(true);

  const renderTags = (tags: string[]) => {
    if (isEmpty(tags)) {
      return <i className="indivisible"><small>No tags</small></i>;
    }

    const selectedTags = shortUrlsListParams.tags ?? [];

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
      setActive();
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

export default ShortUrlsRow;
