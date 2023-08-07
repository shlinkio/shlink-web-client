import { Checkbox } from '@shlinkio/shlink-frontend-kit';
import type { ChangeEvent, FC, PropsWithChildren } from 'react';
import { InfoTooltip } from '../../utils/components/InfoTooltip';

type ShortUrlFormCheckboxGroupProps = PropsWithChildren<{
  checked?: boolean;
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  infoTooltip?: string;
}>;

export const ShortUrlFormCheckboxGroup: FC<ShortUrlFormCheckboxGroupProps> = (
  { children, infoTooltip, checked, onChange },
) => (
  <p>
    <Checkbox inline checked={checked} className={infoTooltip ? 'me-2' : ''} onChange={onChange}>
      {children}
    </Checkbox>
    {infoTooltip && <InfoTooltip placement="right">{infoTooltip}</InfoTooltip>}
  </p>
);
