import { FC } from 'react';
import { Row } from 'reactstrap';
import classNames from 'classnames';
import { SimpleCard } from './SimpleCard';

export type ResultType = 'success' | 'error' | 'warning';

export interface ResultProps {
  type: ResultType;
  className?: string;
  small?: boolean;
}

export const Result: FC<ResultProps> = ({ children, type, className, small = false }) => (
  <Row className={className}>
    <div className={classNames({ 'col-md-10 offset-md-1': !small, 'col-12': small })}>
      <SimpleCard
        className={classNames('text-center', {
          'bg-main': type === 'success',
          'bg-danger': type === 'error',
          'bg-warning': type === 'warning',
          'text-white': type !== 'warning',
        })}
        bodyClassName={classNames({ 'p-2': small })}
      >
        {children}
      </SimpleCard>
    </div>
  </Row>
);
