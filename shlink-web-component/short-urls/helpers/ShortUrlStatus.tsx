import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCalendarXmark, faCheck, faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isBefore } from 'date-fns';
import type { FC, ReactNode } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { formatHumanFriendly, now, parseISO } from '../../../src/utils/helpers/date';
import { useElementRef } from '../../utils/helpers/hooks';
import type { ShortUrl } from '../data';

interface ShortUrlStatusProps {
  shortUrl: ShortUrl;
}

interface StatusResult {
  icon: IconDefinition;
  className: string;
  description: ReactNode;
}

const resolveShortUrlStatus = (shortUrl: ShortUrl): StatusResult => {
  const { meta, visitsCount, visitsSummary } = shortUrl;
  const { maxVisits, validSince, validUntil } = meta;
  const totalVisits = visitsSummary?.total ?? visitsCount;

  if (maxVisits && totalVisits >= maxVisits) {
    return {
      icon: faLinkSlash,
      className: 'text-danger',
      description: (
        <>
          This short URL cannot be currently visited because it has reached the maximum
          amount of <b>{maxVisits}</b> visit{maxVisits > 1 ? 's' : ''}.
        </>
      ),
    };
  }

  if (validUntil && isBefore(parseISO(validUntil), now())) {
    return {
      icon: faCalendarXmark,
      className: 'text-danger',
      description: (
        <>
          This short URL cannot be visited
          since <b className="indivisible">{formatHumanFriendly(parseISO(validUntil))}</b>.
        </>
      ),
    };
  }

  if (validSince && isBefore(now(), parseISO(validSince))) {
    return {
      icon: faCalendarXmark,
      className: 'text-warning',
      description: (
        <>
          This short URL will start working
          on <b className="indivisible">{formatHumanFriendly(parseISO(validSince))}</b>.
        </>
      ),
    };
  }

  return {
    icon: faCheck,
    className: 'text-primary',
    description: 'This short URL can be visited normally.',
  };
};

export const ShortUrlStatus: FC<ShortUrlStatusProps> = ({ shortUrl }) => {
  const tooltipRef = useElementRef<HTMLElement>();
  const { icon, className, description } = resolveShortUrlStatus(shortUrl);

  return (
    <>
      <span style={{ cursor: !description ? undefined : 'help' }} ref={tooltipRef}>
        <FontAwesomeIcon icon={icon} className={className} />
      </span>
      <UncontrolledTooltip target={tooltipRef} placement="bottom">
        {description}
      </UncontrolledTooltip>
    </>
  );
};
