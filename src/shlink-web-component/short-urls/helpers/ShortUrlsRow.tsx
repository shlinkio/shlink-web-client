import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { ExternalLink } from 'react-external-link';
import type { SelectedServer } from '../../../servers/data';
import type { Settings } from '../../../settings/reducers/settings';
import { CopyToClipboardIcon } from '../../../utils/CopyToClipboardIcon';
import { Time } from '../../../utils/dates/Time';
import type { TimeoutToggle } from '../../../utils/helpers/hooks';
import type { ColorGenerator } from '../../../utils/services/ColorGenerator';
import type { ShortUrl } from '../data';
import { useShortUrlsQuery } from './hooks';
import type { ShortUrlsRowMenuType } from './ShortUrlsRowMenu';
import { ShortUrlStatus } from './ShortUrlStatus';
import { ShortUrlVisitsCount } from './ShortUrlVisitsCount';
import { Tags } from './Tags';
import './ShortUrlsRow.scss';

interface ShortUrlsRowProps {
  onTagClick?: (tag: string) => void;
  selectedServer: SelectedServer;
  shortUrl: ShortUrl;
}

interface ShortUrlsRowConnectProps extends ShortUrlsRowProps {
  settings: Settings;
}

export type ShortUrlsRowType = FC<ShortUrlsRowProps>;

export const ShortUrlsRow = (
  ShortUrlsRowMenu: ShortUrlsRowMenuType,
  colorGenerator: ColorGenerator,
  useTimeoutToggle: TimeoutToggle,
) => ({ shortUrl, selectedServer, onTagClick, settings }: ShortUrlsRowConnectProps) => {
  const [copiedToClipboard, setCopiedToClipboard] = useTimeoutToggle();
  const [active, setActive] = useTimeoutToggle(false, 500);
  const isFirstRun = useRef(true);
  const [{ excludeBots }] = useShortUrlsQuery();
  const { visits } = settings;
  const doExcludeBots = excludeBots ?? visits?.excludeBots;

  useEffect(() => {
    !isFirstRun.current && setActive();
    isFirstRun.current = false;
  }, [shortUrl.visitsSummary?.total, shortUrl.visitsSummary?.nonBots, shortUrl.visitsCount]);

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
          visitsCount={(
            doExcludeBots ? shortUrl.visitsSummary?.nonBots : shortUrl.visitsSummary?.total
          ) ?? shortUrl.visitsCount}
          shortUrl={shortUrl}
          selectedServer={selectedServer}
          active={active}
        />
      </td>
      <td className="responsive-table__cell short-urls-row__cell" data-th="Status">
        <ShortUrlStatus shortUrl={shortUrl} />
      </td>
      <td className="responsive-table__cell short-urls-row__cell text-end">
        <ShortUrlsRowMenu selectedServer={selectedServer} shortUrl={shortUrl} />
      </td>
    </tr>
  );
};
