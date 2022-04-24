import { FC, PropsWithChildren, useRef } from 'react';
import { UncontrolledTooltip, UncontrolledTooltipProps } from 'reactstrap';
import { BooleanControlProps } from './BooleanControl';
import ToggleSwitch from './ToggleSwitch';

export type TooltipToggleSwitchProps = BooleanControlProps & PropsWithChildren<{
  tooltip?: Omit<UncontrolledTooltipProps, 'target'>;
}>;

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
