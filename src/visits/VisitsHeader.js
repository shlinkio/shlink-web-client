import { Card, UncontrolledTooltip } from 'reactstrap';
import Moment from 'react-moment';
import React from 'react';
import ExternalLink from '../utils/ExternalLink';
import ShortUrlVisitsCount from '../short-urls/helpers/ShortUrlVisitsCount';
import { shortUrlDetailType } from './reducers/shortUrlDetail';
import './VisitsHeader.scss';

const propTypes = {
  shortUrlDetail: shortUrlDetailType.isRequired,
};

export default function VisitsHeader({ shortUrlDetail }) {
  const { shortUrl, loading } = shortUrlDetail;
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

  return (
    <header>
      <Card className="bg-light" body>
        <h2>
          <span className="badge badge-main float-right">
            Visits:{' '}
            <ShortUrlVisitsCount shortUrl={shortUrl} />
          </span>
          Visit stats for <ExternalLink href={shortLink} />
        </h2>
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
