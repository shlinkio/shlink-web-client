import { UncontrolledTooltip } from 'reactstrap';
import Moment from 'react-moment';
import { ExternalLink } from 'react-external-link';
import { ShortUrlDetail } from './reducers/shortUrlDetail';
import { ShortUrlVisits } from './reducers/shortUrlVisits';
import VisitsHeader from './VisitsHeader';
import './ShortUrlVisitsHeader.scss';

interface ShortUrlVisitsHeaderProps {
  shortUrlDetail: ShortUrlDetail;
  shortUrlVisits: ShortUrlVisits;
  goBack: () => void;
}

const ShortUrlVisitsHeader = ({ shortUrlDetail, shortUrlVisits, goBack }: ShortUrlVisitsHeaderProps) => {
  const { shortUrl, loading } = shortUrlDetail;
  const { visits } = shortUrlVisits;
  const shortLink = shortUrl?.shortUrl ?? '';
  const longLink = shortUrl?.longUrl ?? '';
  const title = shortUrl?.title;

  const renderDate = () => !shortUrl ? <small>Loading...</small> : (
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
    <>
      Visits for <ExternalLink href={shortLink} />
    </>
  );

  return (
    <VisitsHeader title={visitsStatsTitle} goBack={goBack} visits={visits} shortUrl={shortUrl}>
      <hr />
      <div>Created: {renderDate()}</div>
      <div>
        {`${title ? 'Title' : 'Long URL'}: `}
        {loading && <small>Loading...</small>}
        {!loading && <ExternalLink href={longLink}>{title ?? longLink}</ExternalLink>}
      </div>
    </VisitsHeader>
  );
};

export default ShortUrlVisitsHeader;
