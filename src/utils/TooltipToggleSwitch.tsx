import { FC, useRef } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { UncontrolledTooltipProps } from 'reactstrap/lib/Tooltip';
import { BooleanControlProps } from './BooleanControl';
import ToggleSwitch from './ToggleSwitch';

export type TooltipToggleSwitchProps = BooleanControlProps & { tooltip?: Omit<UncontrolledTooltipProps, 'target'> };

export const TooltipToggleSwitch: FC<TooltipToggleSwitchProps> = ({ children, tooltip = {}, ...rest }) => {
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
