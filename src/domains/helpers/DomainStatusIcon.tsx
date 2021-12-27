import { FC, useRef } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { ExternalLink } from 'react-external-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan as forbiddenIcon,
  faCheck as checkIcon,
  faCircleNotch as loadingStatusIcon,
} from '@fortawesome/free-solid-svg-icons';
import { DomainStatus } from '../data';

export const DomainStatusIcon: FC<{ status: DomainStatus }> = ({ status }) => {
  const ref = useRef<HTMLSpanElement>();

  if (status === 'validating') {
    return <FontAwesomeIcon fixedWidth icon={loadingStatusIcon} spin />;
  }

  return (
    <>
      <span
        ref={(el: HTMLSpanElement) => {
          ref.current = el;
        }}
      >
        {status === 'valid'
          ? <FontAwesomeIcon fixedWidth icon={checkIcon} className="text-muted" />
          : <FontAwesomeIcon fixedWidth icon={forbiddenIcon} className="text-danger" />}
      </span>
      <UncontrolledTooltip target={(() => ref.current) as any} placement="bottom" autohide={status === 'valid'}>
        {status === 'valid' ? 'Congratulations! This domain is properly configured.' : (
          <>
            Oops! There is some missing configuration, and short URLs shared with this domain will not work.
            <br />
            Follow <ExternalLink href="https://slnk.to/multi-domain-docs">the documentation</ExternalLink> in order to
            find out what is missing.
          </>
        )}
      </UncontrolledTooltip>
    </>
  );
};
