import { FC, PropsWithChildren } from 'react';
import { InputType } from 'reactstrap/types/lib/Input';
import { LabeledFormGroup } from './LabeledFormGroup';

export type InputFormGroupProps = PropsWithChildren<{
  value: string;
  onChange: (newValue: string) => void;
  type?: InputType;
  required?: boolean;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
}>;

export const InputFormGroup: FC<InputFormGroupProps> = (
  { children, value, onChange, type, required, placeholder, className, labelClassName },
) => (
  <LabeledFormGroup label={<>{children}:</>} className={className ?? ''} labelClassName={labelClassName}>
    <input
      className="form-control"
      type={type ?? 'text'}
      value={value}
      required={required ?? true}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </LabeledFormGroup>
);
