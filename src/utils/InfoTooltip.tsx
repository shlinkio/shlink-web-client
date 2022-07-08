import { FC, PropsWithChildren, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import { Placement } from '@popperjs/core';
import { mutableRefToElementRef } from './helpers/components';

export type InfoTooltipProps = PropsWithChildren<{
  className?: string;
  placement: Placement;
}>;

export const InfoTooltip: FC<InfoTooltipProps> = ({ className = '', placement, children }) => {
  const ref = useRef<HTMLSpanElement | undefined>();

  return (
    <>
      <span className={className} ref={mutableRefToElementRef(ref)}>
        <FontAwesomeIcon icon={infoIcon} />
      </span>
      <UncontrolledTooltip target={(() => ref.current) as any} placement={placement}>{children}</UncontrolledTooltip>
    </>
  );
};
