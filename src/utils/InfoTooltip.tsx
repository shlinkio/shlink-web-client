import { FC, PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import { Placement } from '@popperjs/core';
import { useElementRef } from './helpers/hooks';

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
