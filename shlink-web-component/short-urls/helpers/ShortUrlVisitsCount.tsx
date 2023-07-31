import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';
import { useElementRef } from '../../../shlink-frontend-kit/src';
import { formatHumanFriendly, parseISO } from '../../utils/dates/helpers/date';
import { prettify } from '../../utils/helpers/numbers';
import type { ShortUrl } from '../data';
import { ShortUrlDetailLink } from './ShortUrlDetailLink';
import './ShortUrlVisitsCount.scss';

interface ShortUrlVisitsCountProps {
  shortUrl?: ShortUrl | null;
  visitsCount: number;
  active?: boolean;
  asLink?: boolean;
}

export const ShortUrlVisitsCount = (
  { visitsCount, shortUrl, active = false, asLink = false }: ShortUrlVisitsCountProps,
) => {
  const { maxVisits, validSince, validUntil } = shortUrl?.meta ?? {};
  const hasLimit = !!maxVisits || !!validSince || !!validUntil;
  const visitsLink = (
    <ShortUrlDetailLink shortUrl={shortUrl} suffix="visits" asLink={asLink}>
      <strong
        className={classNames('short-url-visits-count__amount', { 'short-url-visits-count__amount--big': active })}
      >
        {prettify(visitsCount)}
      </strong>
    </ShortUrlDetailLink>
  );

  if (!hasLimit) {
    return visitsLink;
  }

  const tooltipRef = useElementRef<HTMLElement>();

  return (
    <>
      <span className="indivisible">
        {visitsLink}
        <small className="short-urls-visits-count__max-visits-control" ref={tooltipRef}>
          {maxVisits && <> / {prettify(maxVisits)}</>}
          <sup className="ms-1">
            <FontAwesomeIcon icon={infoIcon} />
          </sup>
        </small>
      </span>
      <UncontrolledTooltip target={tooltipRef} placement="bottom">
        <ul className="list-unstyled mb-0">
          {maxVisits && (
            <li className="short-url-visits-count__tooltip-list-item">
              This short URL will not accept more than <b>{prettify(maxVisits)}</b> visit{maxVisits === 1 ? '' : 's'}.
            </li>
          )}
          {validSince && (
            <li className="short-url-visits-count__tooltip-list-item">
              This short URL will not accept visits
              before <b className="indivisible">{formatHumanFriendly(parseISO(validSince))}</b>.
            </li>
          )}
          {validUntil && (
            <li className="short-url-visits-count__tooltip-list-item">
              This short URL will not accept visits
              after <b className="indivisible">{formatHumanFriendly(parseISO(validUntil))}</b>.
            </li>
          )}
        </ul>
      </UncontrolledTooltip>
    </>
  );
};
