import { FC } from 'react';
import { v4 as uuid } from 'uuid';
import { InputType } from 'reactstrap/lib/Input';

interface FormGroupContainerProps {
  value: string;
  onChange: (newValue: string) => void;
  id?: string;
  type?: InputType;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const FormGroupContainer: FC<FormGroupContainerProps> = (
  { children, value, onChange, id = uuid(), type = 'text', required = true, placeholder, className = '' },
) => (
  <div className={`form-group ${className}`}>
    <label htmlFor={id} className="create-server__label">
      {children}:
    </label>
    <input
      className="form-control"
      type={type}
      id={id}
      value={value}
      required={required}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
