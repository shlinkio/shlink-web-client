import { FC } from 'react';
import { Row } from 'reactstrap';
import classNames from 'classnames';
import { SimpleCard } from './SimpleCard';

interface ResultProps {
  type: 'success' | 'error' | 'warning';
  className?: string;
  textCentered?: boolean;
  small?: boolean;
}

export const Result: FC<ResultProps> = ({ children, type, className, textCentered = false, small = false }) => (
  <Row className={className}>
    <div className={classNames({ 'col-md-10 offset-md-1': !small, 'col-12': small })}>
      <SimpleCard
        className={classNames({
          'bg-main': type === 'success',
          'bg-danger': type === 'error',
          'bg-warning': type === 'warning',
          'text-white': type !== 'warning',
          'text-center': textCentered,
        })}
        bodyClassName={classNames({ 'p-2': small })}
      >
        {children}
      </SimpleCard>
    </div>
  </Row>
);
