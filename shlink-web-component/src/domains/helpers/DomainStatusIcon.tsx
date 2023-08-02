import {
  faCheck as checkIcon,
  faCircleNotch as loadingStatusIcon,
  faTimes as invalidIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { ExternalLink } from 'react-external-link';
import { UncontrolledTooltip } from 'reactstrap';
import { useElementRef } from '../../../../shlink-frontend-kit/src';
import type { MediaMatcher } from '../../utils/types';
import type { DomainStatus } from '../data';

interface DomainStatusIconProps {
  status: DomainStatus;
  matchMedia?: MediaMatcher;
}

export const DomainStatusIcon: FC<DomainStatusIconProps> = ({ status, matchMedia = window.matchMedia }) => {
  const ref = useElementRef<HTMLSpanElement>();
  const matchesMobile = () => matchMedia('(max-width: 991px)').matches;
  const [isMobile, setIsMobile] = useState<boolean>(matchesMobile());

  useEffect(() => {
    const listener = () => setIsMobile(matchesMobile());

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, []);

  if (status === 'validating') {
    return <FontAwesomeIcon fixedWidth icon={loadingStatusIcon} spin />;
  }

  return (
    <>
      <span ref={ref}>
        {status === 'valid'
          ? <FontAwesomeIcon fixedWidth icon={checkIcon} className="text-muted" />
          : <FontAwesomeIcon fixedWidth icon={invalidIcon} className="text-danger" />}
      </span>
      <UncontrolledTooltip
        target={ref}
        placement={isMobile ? 'top-start' : 'left'}
        autohide={status === 'valid'}
      >
        {status === 'valid' ? 'Congratulations! This domain is properly configured.' : (
          <span>
            Oops! There is some missing configuration, and short URLs shared with this domain will not work.
            <br />
            Check the <ExternalLink href="https://slnk.to/multi-domain-docs">documentation</ExternalLink> in order to
            find out what is missing.
          </span>
        )}
      </UncontrolledTooltip>
    </>
  );
};
