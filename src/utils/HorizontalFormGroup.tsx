import { FC } from 'react';
import { v4 as uuid } from 'uuid';
import { InputType } from 'reactstrap/lib/Input';

interface HorizontalFormGroupProps {
  value: string;
  onChange: (newValue: string) => void;
  id?: string;
  type?: InputType;
  required?: boolean;
}

export const HorizontalFormGroup: FC<HorizontalFormGroupProps> = (
  { children, value, onChange, id = uuid(), type = 'text', required = true },
) => (
  <div className="form-group row">
    <label htmlFor={id} className="col-lg-1 col-md-2 col-form-label create-server__label">
      {children}:
    </label>
    <div className="col-lg-11 col-md-10">
      <input
        className="form-control"
        type={type}
        id={id}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);
