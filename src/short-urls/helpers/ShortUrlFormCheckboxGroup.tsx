import { ChangeEvent, FC, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import Checkbox from '../../utils/Checkbox';

interface ShortUrlFormCheckboxGroupProps {
  checked?: boolean;
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  infoTooltip?: string;
}

const InfoTooltip: FC<{ tooltip: string }> = ({ tooltip }) => {
  const ref = useRef<HTMLElement | null>();

  return (
    <>
      <span
        ref={(el) => {
          ref.current = el;
        }}
      >
        <FontAwesomeIcon icon={infoIcon} />
      </span>
      <UncontrolledTooltip target={(() => ref.current) as any} placement="right">{tooltip}</UncontrolledTooltip>
    </>
  );
};

export const ShortUrlFormCheckboxGroup: FC<ShortUrlFormCheckboxGroupProps> = (
  { children, infoTooltip, checked, onChange },
) => (
  <p>
    <Checkbox inline checked={checked} className={infoTooltip ? 'mr-2' : ''} onChange={onChange}>
      {children}
    </Checkbox>
    {infoTooltip && <InfoTooltip tooltip={infoTooltip} />}
  </p>
);
