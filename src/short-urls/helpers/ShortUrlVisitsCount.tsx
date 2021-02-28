import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';
import { prettify } from '../../utils/helpers/numbers';
import VisitStatsLink, { VisitStatsLinkProps } from './VisitStatsLink';
import './ShortUrlVisitsCount.scss';

// TODO This interface should be called ShortUrlVisitsCountProps, and the component should not have the Comp suffix
export interface ShortUrlVisitsCount extends VisitStatsLinkProps {
  visitsCount: number;
  active?: boolean;
}

const ShortUrlVisitsCountComp = ({ visitsCount, shortUrl, selectedServer, active = false }: ShortUrlVisitsCount) => {
  const maxVisits = shortUrl?.meta?.maxVisits;
  const visitsLink = (
    <VisitStatsLink selectedServer={selectedServer} shortUrl={shortUrl}>
      <strong
        className={classNames('short-url-visits-count__amount', { 'short-url-visits-count__amount--big': active })}
      >
        {prettify(visitsCount)}
      </strong>
    </VisitStatsLink>
  );

  if (!maxVisits) {
    return visitsLink;
  }

  const prettifiedMaxVisits = prettify(maxVisits);
  const tooltipRef = useRef<HTMLElement | null>();

  return (
    <>
      <span className="indivisible">
        {visitsLink}
        <small
          className="short-urls-visits-count__max-visits-control"
          ref={(el) => {
            tooltipRef.current = el;
          }}
        >
          {' '}/ {prettifiedMaxVisits}{' '}
          <sup>
            <FontAwesomeIcon icon={infoIcon} />
          </sup>
        </small>
      </span>
      <UncontrolledTooltip target={(() => tooltipRef.current) as any} placement="bottom">
        This short URL will not accept more than <b>{prettifiedMaxVisits}</b> visits.
      </UncontrolledTooltip>
    </>
  );
};

export default ShortUrlVisitsCountComp;
