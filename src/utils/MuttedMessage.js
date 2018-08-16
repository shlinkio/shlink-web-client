import React from 'react';
import { Card } from 'reactstrap';
import classnames from 'classnames';

export default function MutedMessage({ children, marginSize = 4 }) {
  const cardClasses = classnames('bg-light', `mt-${marginSize}`);

  return (
    <div className="col-md-10 offset-md-1">
      <Card className={cardClasses} body>
        <h3 className="text-center text-muted mb-0">
          {children}
        </h3>
      </Card>
    </div>
  );
}
