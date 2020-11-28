import { ChangeEvent, FC } from 'react';
import classNames from 'classnames';
import { v4 as uuid } from 'uuid';
import { identity } from 'ramda';

export interface BooleanControlProps {
  checked?: boolean;
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inline?: boolean;
}

interface BooleanControlWithTypeProps extends BooleanControlProps {
  type: 'switch' | 'checkbox';
}

const BooleanControl: FC<BooleanControlWithTypeProps> = (
  { checked = false, onChange = identity, className, children, type, inline = false },
) => {
  const id = uuid();
  const onChecked = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked, e);
  const typeClasses = {
    'custom-switch': type === 'switch',
    'custom-checkbox': type === 'checkbox',
  };
  const style = inline ? { display: 'inline-block' } : {};

  return (
    <span className={classNames('custom-control', typeClasses, className)} style={style}>
      <input type="checkbox" className="custom-control-input" id={id} checked={checked} onChange={onChecked} />
      <label className="custom-control-label" htmlFor={id}>{children}</label>
    </span>
  );
};

export default BooleanControl;
