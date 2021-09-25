import { FC, useRef } from 'react';
import * as Popper from 'popper.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';

interface InfoTooltipProps {
  className?: string;
  placement: Popper.Placement;
}

export const InfoTooltip: FC<InfoTooltipProps> = ({ className = '', placement, children }) => {
  const ref = useRef<HTMLSpanElement | null>();
  const refCallback = (el: HTMLSpanElement) => {
    ref.current = el;
  };

  return (
    <>
      <span className={className} ref={refCallback}>
        <FontAwesomeIcon icon={infoIcon} />
      </span>
      <UncontrolledTooltip target={(() => ref.current) as any} placement={placement}>{children}</UncontrolledTooltip>
    </>
  );
};
