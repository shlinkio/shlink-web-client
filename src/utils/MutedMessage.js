import React from 'react';
import { Card } from 'reactstrap';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { faCircleNotch as preloader } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const propTypes = {
  noMargin: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

const MutedMessage = ({ children, loading = false, noMargin = false }) => {
  const cardClasses = classNames('bg-light', {
    'mt-4': !noMargin,
  });

  return (
    <div className="col-md-10 offset-md-1">
      <Card className={cardClasses} body>
        <h3 className="text-center text-muted mb-0">
          {loading && <FontAwesomeIcon icon={preloader} spin />}
          {loading && !children && <span className="ml-2">Loading...</span>}
          {children}
        </h3>
      </Card>
    </div>
  );
};

MutedMessage.propTypes = propTypes;

export default MutedMessage;
