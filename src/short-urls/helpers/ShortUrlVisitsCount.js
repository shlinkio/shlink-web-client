import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import { shortUrlType } from '../reducers/shortUrlsList';

const propTypes = {
  shortUrl: shortUrlType,
};

const ShortUrlVisitsCount = ({ shortUrl }) => {
  const { visitsCount, meta } = shortUrl;
  const maxVisits = meta && meta.maxVisits;

  if (!maxVisits) {
    return <span>{visitsCount}</span>;
  }

  return (
    <React.Fragment>
      <span>
        {visitsCount}
        <small id="maxVisitsControl" className="short-urls-row__max-visits-control">
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
