import { Card, UncontrolledTooltip } from 'reactstrap';
import Moment from 'react-moment';
import React from 'react';
import PropTypes from 'prop-types';
import ExternalLink from '../utils/ExternalLink';
import { shortUrlVisitsType } from './reducers/shortUrlVisits';
import './VisitsHeader.scss';

const propTypes = {
  shortUrlVisits: shortUrlVisitsType,
  shortLink: PropTypes.string,
};

export function VisitsHeader({ shortUrlVisits, shortLink }) {
  const { shortUrl, loading } = shortUrlVisits;
  const renderDate = () => (
    <span>
      <b id="created" className="visits-header__created-at"><Moment fromNow>{shortUrl.dateCreated}</Moment></b>
      <UncontrolledTooltip placement="bottom" target="created">
        <Moment format="YYYY-MM-DD HH:mm">{shortUrl.dateCreated}</Moment>
      </UncontrolledTooltip>
    </span>
  );

  return (
    <header>
      <Card className="bg-light" body>
        <h2>
          {shortUrl.visitsCount &&
          <span className="badge badge-main float-right">Visits: {shortUrl.visitsCount}</span>}
          Visit stats for <ExternalLink href={shortLink}>{shortLink}</ExternalLink>
        </h2>
        <hr />
        {shortUrl.dateCreated && (
          <div>
            Created:
            &nbsp;
            {loading && <small>Loading...</small>}
            {!loading && renderDate()}
          </div>
        )}
        <div>
          Long URL:
          &nbsp;
          {loading && <small>Loading...</small>}
          {!loading && <ExternalLink href={shortUrl.longUrl}>{shortUrl.longUrl}</ExternalLink>}
        </div>
      </Card>
    </header>
  );
}

VisitsHeader.propTypes = propTypes;
