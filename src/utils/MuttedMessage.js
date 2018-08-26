import React from 'react';
import { Card } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const DEFAULT_MARGIN_SIZE = 4;
const propTypes = {
  marginSize: PropTypes.number,
  children: PropTypes.node,
};

export default function MutedMessage({ children, marginSize = DEFAULT_MARGIN_SIZE }) {
  const cardClasses = classnames('bg-light', {
    [`mt-${marginSize}`]: marginSize > 0,
  });

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

MutedMessage.propTypes = propTypes;
