import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Placement } from '@popperjs/core';
import type { FC, PropsWithChildren } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { useElementRef } from '../../../shlink-frontend-kit/src';

export type InfoTooltipProps = PropsWithChildren<{
  className?: string;
  placement: Placement;
}>;

export const InfoTooltip: FC<InfoTooltipProps> = ({ className = '', placement, children }) => {
  const ref = useElementRef<HTMLSpanElement>();

  return (
    <>
      <span className={className} ref={ref}>
        <FontAwesomeIcon icon={infoIcon} />
      </span>
      <UncontrolledTooltip target={ref} placement={placement}>{children}</UncontrolledTooltip>
    </>
  );
};
