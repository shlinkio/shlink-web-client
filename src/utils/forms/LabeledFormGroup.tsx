import { FC, ReactNode } from 'react';

interface LabeledFormGroupProps {
  label: ReactNode;
  noMargin?: boolean;
  className?: string;
  labelClassName?: string;
}

export const LabeledFormGroup: FC<LabeledFormGroupProps> = (
  { children, label, className = '', labelClassName = '', noMargin = false },
) => (
  <div className={`${className} ${noMargin ? '' : 'mb-3'}`}>
    <label className={`form-label ${labelClassName}`}>{label}</label>
    {children}
  </div>
);
