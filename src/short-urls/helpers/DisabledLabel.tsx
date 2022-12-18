import { FC, useRef } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import { mutableRefToElementRef } from '../../utils/helpers/components';

export const DisabledLabel: FC = () => {
  const tooltipRef = useRef<HTMLElement | undefined>();

  return (
    <>
      <span style={{ cursor: 'help' }} ref={mutableRefToElementRef(tooltipRef)} className="badge text-bg-danger">
        <FontAwesomeIcon icon={faLinkSlash} className="me-1" />
        Disabled
      </span>
      <UncontrolledTooltip target={(() => tooltipRef.current) as any} placement="left">
        This short URL cannot be currently visited because of some of its limits.
      </UncontrolledTooltip>
    </>
  );
};
