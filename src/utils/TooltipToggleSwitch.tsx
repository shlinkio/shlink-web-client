import { FC, useRef } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { UncontrolledTooltipProps } from 'reactstrap/lib/Tooltip';
import { BooleanControlProps } from './BooleanControl';
import ToggleSwitch from './ToggleSwitch';

export const TooltipToggleSwitch: FC<BooleanControlProps & { tooltip?: Omit<UncontrolledTooltipProps, 'target'> }> = (
  { children, tooltip = {}, ...rest },
) => {
  const ref = useRef<HTMLSpanElement>();

  return (
    <>
      <span
        ref={(el) => {
          ref.current = el ?? undefined;
        }}
      >
        <ToggleSwitch {...rest} />
      </span>
      <UncontrolledTooltip target={(() => ref.current) as any} {...tooltip}>{children}</UncontrolledTooltip>
    </>
  );
};
