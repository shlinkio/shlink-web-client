import { FC, PropsWithChildren } from 'react';

export const FormText: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <small className="form-text text-muted d-block">{children}</small>
);
