import { Button, Card, UncontrolledTooltip } from 'reactstrap';
import Moment from 'react-moment';
import React from 'react';
import PropTypes from 'prop-types';
import { ExternalLink } from 'react-external-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ShortUrlVisitsCount from '../short-urls/helpers/ShortUrlVisitsCount';
import { shortUrlDetailType } from './reducers/shortUrlDetail';
import { shortUrlVisitsType } from './reducers/shortUrlVisits';
import './VisitsHeader.scss';

const propTypes = {
  shortUrlDetail: shortUrlDetailType.isRequired,
  shortUrlVisits: shortUrlVisitsType.isRequired,
  goBack: PropTypes.func.isRequired,
};

export default function VisitsHeader({ shortUrlDetail, shortUrlVisits, goBack }) {
  const { shortUrl, loading } = shortUrlDetail;
  const { visits } = shortUrlVisits;
  const shortLink = shortUrl && shortUrl.shortUrl ? shortUrl.shortUrl : '';
  const longLink = shortUrl && shortUrl.longUrl ? shortUrl.longUrl : '';

  const renderDate = () => (
    <span>
      <b id="created" className="visits-header__created-at"><Moment fromNow>{shortUrl.dateCreated}</Moment></b>
      <UncontrolledTooltip placement="bottom" target="created">
        <Moment format="YYYY-MM-DD HH:mm">{shortUrl.dateCreated}</Moment>
      </UncontrolledTooltip>
    </span>
  );
  const visitsStatsTitle = (
    <React.Fragment>
      Visit stats for <ExternalLink href={shortLink} />
    </React.Fragment>
  );

  return (
    <header>
      <Card className="bg-light" body>
        <h2 className="d-flex justify-content-between align-items-center">
          <Button color="link" size="lg" className="p-0 mr-3" onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <span className="text-center d-none d-sm-block">
            {visitsStatsTitle}
          </span>
          <span className="badge badge-main ml-3">
            Visits:{' '}
            <ShortUrlVisitsCount visitsCount={visits.length} shortUrl={shortUrl} />
          </span>
        </h2>
        <h3 className="text-center d-block d-sm-none mb-0">{visitsStatsTitle}</h3>
        <hr />
        <div>Created: {renderDate()}</div>
        <div>
          Long URL:{' '}
          {loading && <small>Loading...</small>}
          {!loading && <ExternalLink href={longLink} />}
        </div>
      </Card>
    </header>
  );
}

VisitsHeader.propTypes = propTypes;
