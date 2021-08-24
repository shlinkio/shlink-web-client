import { ChangeEvent, FC } from 'react';
import Checkbox from '../../utils/Checkbox';
import { InfoTooltip } from '../../utils/InfoTooltip';

interface ShortUrlFormCheckboxGroupProps {
  checked?: boolean;
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  infoTooltip?: string;
}

export const ShortUrlFormCheckboxGroup: FC<ShortUrlFormCheckboxGroupProps> = (
  { children, infoTooltip, checked, onChange },
) => (
  <p>
    <Checkbox inline checked={checked} className={infoTooltip ? 'mr-2' : ''} onChange={onChange}>
      {children}
    </Checkbox>
    {infoTooltip && <InfoTooltip placement="right">{infoTooltip}</InfoTooltip>}
  </p>
);
