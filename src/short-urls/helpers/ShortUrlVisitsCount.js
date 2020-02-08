import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import { serverType } from '../../servers/prop-types';
import { shortUrlType } from '../reducers/shortUrlsList';
import './ShortUrlVisitsCount.scss';
import VisitStatsLink from './VisitStatsLink';

const propTypes = {
  visitsCount: PropTypes.number.isRequired,
  shortUrl: shortUrlType,
  selectedServer: serverType,
};

const ShortUrlVisitsCount = ({ visitsCount, shortUrl, selectedServer }) => {
  const maxVisits = shortUrl && shortUrl.meta && shortUrl.meta.maxVisits;
  const visitsLink = (
    <VisitStatsLink selectedServer={selectedServer} shortUrl={shortUrl}>
      <strong>{visitsCount}</strong>
    </VisitStatsLink>
  );

  if (!maxVisits) {
    return visitsLink;
  }

  return (
    <React.Fragment>
      <span className="indivisible">
        {visitsLink}
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
