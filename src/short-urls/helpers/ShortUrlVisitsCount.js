import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import { shortUrlMetaType } from '../reducers/shortUrlsList';
import './ShortUrlVisitsCount.scss';

const propTypes = {
  visitsCount: PropTypes.number.isRequired,
  meta: shortUrlMetaType,
};

const ShortUrlVisitsCount = ({ visitsCount, meta }) => {
  const maxVisits = meta && meta.maxVisits;

  if (!maxVisits) {
    return <span>{visitsCount}</span>;
  }

  return (
    <React.Fragment>
      <span className="indivisible">
        {visitsCount}
        <small id="maxVisitsControl" className="short-urls-visits-count__max-visits-control">
          {' '}/ {maxVisits}{' '}
          <sup>
            <FontAwesomeIcon icon={infoIcon} />
          </sup>
        </small>
      </span>
      <UncontrolledTooltip target="maxVisitsControl" placement="bottom">
        This short URL will not accept more than <b>{maxVisits}</b> visits.
      </UncontrolledTooltip>
    </React.Fragment>
  );
};

ShortUrlVisitsCount.propTypes = propTypes;

export default ShortUrlVisitsCount;
