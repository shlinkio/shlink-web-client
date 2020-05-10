import { UncontrolledTooltip } from 'reactstrap';
import Moment from 'react-moment';
import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLink } from 'react-external-link';
import { shortUrlDetailType } from './reducers/shortUrlDetail';
import { shortUrlVisitsType } from './reducers/shortUrlVisits';
import VisitsHeader from './VisitsHeader';
import './ShortUrlVisitsHeader.scss';

const propTypes = {
  shortUrlDetail: shortUrlDetailType.isRequired,
  shortUrlVisits: shortUrlVisitsType.isRequired,
  goBack: PropTypes.func.isRequired,
};

export default function ShortUrlVisitsHeader({ shortUrlDetail, shortUrlVisits, goBack }) {
  const { shortUrl, loading } = shortUrlDetail;
  const { visits } = shortUrlVisits;
  const shortLink = shortUrl && shortUrl.shortUrl ? shortUrl.shortUrl : '';
  const longLink = shortUrl && shortUrl.longUrl ? shortUrl.longUrl : '';

  const renderDate = () => (
    <span>
      <b id="created" className="short-url-visits-header__created-at">
        <Moment fromNow>{shortUrl.dateCreated}</Moment>
      </b>
      <UncontrolledTooltip placement="bottom" target="created">
        <Moment format="YYYY-MM-DD HH:mm">{shortUrl.dateCreated}</Moment>
      </UncontrolledTooltip>
    </span>
  );
  const visitsStatsTitle = (
    <React.Fragment>
      Visits for <ExternalLink href={shortLink} />
    </React.Fragment>
  );

  return (
    <VisitsHeader title={visitsStatsTitle} goBack={goBack} visits={visits} shortUrl={shortUrl}>
      <hr />
      <div>Created: {renderDate()}</div>
      <div>
        Long URL:{' '}
        {loading && <small>Loading...</small>}
        {!loading && <ExternalLink href={longLink} />}
      </div>
    </VisitsHeader>
  );
}

ShortUrlVisitsHeader.propTypes = propTypes;
