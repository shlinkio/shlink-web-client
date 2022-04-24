import { ChangeEvent, FC, PropsWithChildren } from 'react';
import classNames from 'classnames';
import { identity } from 'ramda';
import { useDomId } from './helpers/hooks';

export type BooleanControlProps = PropsWithChildren<{
  checked?: boolean;
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inline?: boolean;
}>;

interface BooleanControlWithTypeProps extends BooleanControlProps {
  type: 'switch' | 'checkbox';
}

const BooleanControl: FC<BooleanControlWithTypeProps> = (
  { checked = false, onChange = identity, className, children, type, inline = false },
) => {
  const id = useDomId();
  const onChecked = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked, e);
  const typeClasses = {
    'form-switch': type === 'switch',
    'form-checkbox': type === 'checkbox',
  };
  const style = inline ? { display: 'inline-block' } : {};

  return (
    <span className={classNames('form-check', typeClasses, className)} style={style}>
      <input type="checkbox" className="form-check-input" id={id} checked={checked} onChange={onChecked} />
      <label className="form-check-label" htmlFor={id}>{children}</label>
    </span>
  );
};

export default BooleanControl;
