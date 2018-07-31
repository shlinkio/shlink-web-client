import React from 'react';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { pick } from 'ramda';
import { Card, CardBody, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { getShortUrlVisits } from './reducers/shortUrlVisits';
import VisitsParser from '../visits/services/VisitsParser';
import preloader from '@fortawesome/fontawesome-free-solid/faCircleNotch';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export class ShortUrlsVisits extends React.Component {
  state = { startDate: '', endDate: '' };

  componentDidMount() {
    const { match: { params } } = this.props;
    this.props.getShortUrlVisits(params.shortCode, this.state);
  }

  render() {
    const {
      match: { params },
      selectedServer,
      visitsParser,
      shortUrlVisits: { visits, loading, error, shortUrl }
    } = this.props;
    const colors = [
      '#97BBCD',
      '#DCDCDC',
      '#F7464A',
      '#46BFBD',
      '#FDB45C',
      '#949FB1',
      '#4D5360'
    ];
    const serverUrl = selectedServer ? selectedServer.url : '';
    const shortLink = `${serverUrl}/${params.shortCode}`;
    const generateGraphData = (stats, label, isBarChart) => ({
      labels: Object.keys(stats),
      datasets: [
        {
          label,
          data: Object.values(stats),
          backgroundColor: isBarChart ? 'rgba(70, 150, 229, 0.4)' : colors,
          borderColor: isBarChart ? 'rgba(70, 150, 229, 1)' : 'white',
          borderWidth: 2
        }
      ]
    });
    const renderGraphCard = (title, stats, isBarChart, label) =>
      <div className="col-md-6">
        <Card className="mt-4">
          <CardHeader>{title}</CardHeader>
          <CardBody>
            {!isBarChart && <Doughnut data={generateGraphData(stats, label || title, isBarChart)} options={{
              legend: {
                position: 'right'
              }
            }} />}
            {isBarChart && <HorizontalBar data={generateGraphData(stats, label || title, isBarChart)} options={{
              legend: {
                display: false
              }
            }} />}
          </CardBody>
        </Card>
      </div>;
    const renderContent = () => {
      if (loading) {
        return (
          <div className="col-md-10 offset-md-1">
            <Card className="bg-light mt-4" body>
              <h3 className="text-center text-muted">
                <FontAwesomeIcon icon={preloader} spin /> Loading...
              </h3>
            </Card>
          </div>
        );
      }

      if (error) {
        return (
          <Card className="mt-4" body inverse color="danger">
            An error occurred while loading visits :(
          </Card>
        );
      }

      return (
        <div className="row">
          {renderGraphCard('Operating systems', visitsParser.processOsStats(visits), false)}
          {renderGraphCard('Browsers', visitsParser.processBrowserStats(visits), false)}
          {renderGraphCard('Countries', visitsParser.processCountriesStats(visits), true, 'Visits')}
          {renderGraphCard('Referrers', visitsParser.processReferrersStats(visits), true, 'Visits')}
        </div>
      );
    };

    const renderCreated = () =>
      <span>
        <b id="created"><Moment fromNow>{shortUrl.dateCreated}</Moment></b>
        <UncontrolledTooltip placement="bottom" target="created">
          <Moment format="YYYY-MM-DD HH:mm">{shortUrl.dateCreated}</Moment>
        </UncontrolledTooltip>
      </span>;
    return (
      <div className="short-urls-container">
        <header>
          <Card className="bg-light">
            <CardBody>
              <h2>
                {
                  shortUrl.visitsCount &&
                  <span className="badge badge-primary float-right">Visits: {shortUrl.visitsCount}</span>
                }
                Visit stats for <a target="_blank" href={shortLink}>{shortLink}</a>
              </h2>
              <hr />
              {shortUrl.dateCreated && <div>
                Created:
                &nbsp;
                {loading && <small>Loading...</small>}
                {!loading && renderCreated()}
              </div>}
              <div>
                Original URL:
                &nbsp;
                {loading && <small>Loading...</small>}
                {!loading && <a target="_blank" href={shortUrl.longUrl}>{shortUrl.longUrl}</a>}
              </div>
            </CardBody>
          </Card>
        </header>

        <section>
          {renderContent()}
        </section>
      </div>
    );
  }
}

ShortUrlsVisits.defaultProps = {
  visitsParser: VisitsParser
};

export default connect(pick(['selectedServer', 'shortUrlVisits']), {
  getShortUrlVisits
})(ShortUrlsVisits);
