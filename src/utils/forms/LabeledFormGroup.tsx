import { FC, PropsWithChildren, ReactNode } from 'react';

type LabeledFormGroupProps = PropsWithChildren<{
  label: ReactNode;
  noMargin?: boolean;
  className?: string;
  labelClassName?: string;
}>;

/* eslint-disable jsx-a11y/label-has-associated-control */
export const LabeledFormGroup: FC<LabeledFormGroupProps> = (
  { children, label, className = '', labelClassName = '', noMargin = false },
) => (
  <div className={`${className} ${noMargin ? '' : 'mb-3'}`}>
    <label className={`form-label ${labelClassName}`}>{label}</label>
    {children}
  </div>
);
