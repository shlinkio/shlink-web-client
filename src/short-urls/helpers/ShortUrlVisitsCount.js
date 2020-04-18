import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle as infoIcon } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';
import { serverType } from '../../servers/prop-types';
import { prettify } from '../../utils/helpers/numbers';
import { shortUrlType } from '../reducers/shortUrlsList';
import VisitStatsLink from './VisitStatsLink';
import './ShortUrlVisitsCount.scss';

const propTypes = {
  visitsCount: PropTypes.number.isRequired,
  shortUrl: shortUrlType,
  selectedServer: serverType,
  active: PropTypes.bool,
};

const ShortUrlVisitsCount = ({ visitsCount, shortUrl, selectedServer, active = false }) => {
  const maxVisits = shortUrl && shortUrl.meta && shortUrl.meta.maxVisits;
  const visitsLink = (
    <VisitStatsLink selectedServer={selectedServer} shortUrl={shortUrl}>
      <strong
        className={classNames('short-url-visits-count__amount', { 'short-url-visits-count__amount--big': active })}
      >
        {prettify(visitsCount)}
      </strong>
    </VisitStatsLink>
  );

  if (!maxVisits) {
    return visitsLink;
  }

  const prettifiedMaxVisits = prettify(maxVisits);
  const tooltipRef = useRef();

  return (
    <React.Fragment>
      <span className="indivisible">
        {visitsLink}
        <small
          className="short-urls-visits-count__max-visits-control"
          ref={(el) => {
            tooltipRef.current = el;
          }}
        >
          {' '}/ {prettifiedMaxVisits}{' '}
          <sup>
            <FontAwesomeIcon icon={infoIcon} />
          </sup>
        </small>
      </span>
      <UncontrolledTooltip target={() => tooltipRef.current} placement="bottom">
        This short URL will not accept more than <b>{prettifiedMaxVisits}</b> visits.
      </UncontrolledTooltip>
    </React.Fragment>
  );
};

ShortUrlVisitsCount.propTypes = propTypes;

export default ShortUrlVisitsCount;
