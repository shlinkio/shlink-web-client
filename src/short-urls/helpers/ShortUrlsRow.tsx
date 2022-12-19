import { useEffect, useRef } from 'react';
import { ExternalLink } from 'react-external-link';
import { ColorGenerator } from '../../utils/services/ColorGenerator';
import { TimeoutToggle } from '../../utils/helpers/hooks';
import { SelectedServer } from '../../servers/data';
import { CopyToClipboardIcon } from '../../utils/CopyToClipboardIcon';
import { ShortUrl } from '../data';
import { Time } from '../../utils/dates/Time';
import { ShortUrlVisitsCount } from './ShortUrlVisitsCount';
import { ShortUrlsRowMenuType } from './ShortUrlsRowMenu';
import { Tags } from './Tags';
import { ShortUrlStatus } from './ShortUrlStatus';
import './ShortUrlsRow.scss';

interface ShortUrlsRowProps {
  onTagClick?: (tag: string) => void;
  selectedServer: SelectedServer;
  shortUrl: ShortUrl;
}

export const ShortUrlsRow = (
  ShortUrlsRowMenu: ShortUrlsRowMenuType,
  colorGenerator: ColorGenerator,
  useTimeoutToggle: TimeoutToggle,
) => ({ shortUrl, selectedServer, onTagClick }: ShortUrlsRowProps) => {
  const [copiedToClipboard, setCopiedToClipboard] = useTimeoutToggle();
  const [active, setActive] = useTimeoutToggle(false, 500);
  const isFirstRun = useRef(true);

  useEffect(() => {
    !isFirstRun.current && setActive();
    isFirstRun.current = false;
  }, [shortUrl.visitsCount]);

  return (
    <tr className="responsive-table__row">
      <td className="indivisible short-urls-row__cell responsive-table__cell" data-th="Created at">
        <Time date={shortUrl.dateCreated} />
      </td>
      <td className="responsive-table__cell short-urls-row__cell" data-th="Short URL">
        <span className="position-relative short-urls-row__cell--indivisible">
          <span className="short-urls-row__short-url-wrapper">
            <ExternalLink href={shortUrl.shortUrl} />
          </span>
          <CopyToClipboardIcon text={shortUrl.shortUrl} onCopy={setCopiedToClipboard} />
          <span className="badge bg-warning text-black short-urls-row__copy-hint" hidden={!copiedToClipboard}>
            Copied short URL!
          </span>
        </span>
      </td>
      <td
        className="responsive-table__cell short-urls-row__cell short-urls-row__cell--break"
        data-th={`${shortUrl.title ? 'Title' : 'Long URL'}`}
      >
        <ExternalLink href={shortUrl.longUrl}>{shortUrl.title ?? shortUrl.longUrl}</ExternalLink>
      </td>
      {shortUrl.title && (
        <td className="short-urls-row__cell responsive-table__cell short-urls-row__cell--break d-lg-none" data-th="Long URL">
          <ExternalLink href={shortUrl.longUrl} />
        </td>
      )}
      <td className="responsive-table__cell short-urls-row__cell" data-th="Tags">
        <Tags tags={shortUrl.tags} colorGenerator={colorGenerator} onTagClick={onTagClick} />
      </td>
      <td className="responsive-table__cell short-urls-row__cell text-lg-end" data-th="Visits">
        <ShortUrlVisitsCount
          visitsCount={shortUrl.visitsCount}
          shortUrl={shortUrl}
          selectedServer={selectedServer}
          active={active}
        />
      </td>
      <td className="responsive-table__cell short-urls-row__cell" data-th="Status">
        <ShortUrlStatus shortUrl={shortUrl} />
      </td>
      <td className="responsive-table__cell short-urls-row__cell">
        <ShortUrlsRowMenu selectedServer={selectedServer} shortUrl={shortUrl} />
      </td>
    </tr>
  );
};

export type ShortUrlsRowType = ReturnType<typeof ShortUrlsRow>;
