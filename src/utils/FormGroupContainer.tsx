import { FC, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { InputType } from 'reactstrap/lib/Input';

export interface FormGroupContainerProps {
  value: string;
  onChange: (newValue: string) => void;
  id?: string;
  type?: InputType;
  required?: boolean;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
}

export const FormGroupContainer: FC<FormGroupContainerProps> = (
  { children, value, onChange, id, type, required, placeholder, className, labelClassName },
) => {
  const forId = useRef<string>(id ?? uuid());

  return (
    <div className={`form-group ${className ?? ''}`}>
      <label htmlFor={forId.current} className={labelClassName ?? ''}>
        {children}:
      </label>
      <input
        className="form-control"
        type={type ?? 'text'}
        id={forId.current}
        value={value}
        required={required ?? true}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
