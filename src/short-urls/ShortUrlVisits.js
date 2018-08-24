import preloader from '@fortawesome/fontawesome-free-solid/faCircleNotch'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { isEmpty, mapObjIndexed, pick } from 'ramda'
import React from 'react'
import { Doughnut, HorizontalBar } from 'react-chartjs-2'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import { Card, CardBody, CardHeader, UncontrolledTooltip } from 'reactstrap'
import DateInput from '../common/DateInput'
import visitsParser from '../visits/services/VisitsParser'
import { getShortUrlVisits } from './reducers/shortUrlVisits'
import './ShortUrlVisits.scss'
import MutedMessage from '../utils/MuttedMessage';

const defaultProps = {
  visitsParser,
};

export class ShortUrlsVisits extends React.Component {
  state = { startDate: undefined, endDate: undefined };
  loadVisits = () => {
    const { match: { params } } = this.props;
    this.props.getShortUrlVisits(params.shortCode, mapObjIndexed(
      value => value && value.format ? value.format('YYYY-MM-DD') : value,
      this.state
    ))
  };

  componentDidMount() {
    this.loadVisits();
  }

  render() {
    const {
      match: { params },
      selectedServer,
      visitsParser,
      shortUrlVisits: { visits, loading, error, shortUrl }
    } = this.props;
    const serverUrl = selectedServer ? selectedServer.url : '';
    const shortLink = `${serverUrl}/${params.shortCode}`;
    const generateGraphData = (stats, label, isBarChart) => ({
      labels: Object.keys(stats),
      datasets: [
        {
          label,
          data: Object.values(stats),
          backgroundColor: isBarChart ? 'rgba(70, 150, 229, 0.4)' : [
            '#97BBCD',
            '#DCDCDC',
            '#F7464A',
            '#46BFBD',
            '#FDB45C',
            '#949FB1',
            '#4D5360'
          ],
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
        return <MutedMessage><FontAwesomeIcon icon={preloader} spin /> Loading...</MutedMessage>;
      }

      if (error) {
        return (
          <Card className="mt-4" body inverse color="danger">
            An error occurred while loading visits :(
          </Card>
        );
      }

      if (isEmpty(visits)) {
        return <MutedMessage>There have been no visits matching current filter  :(</MutedMessage>;
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
      <div className="shlink-container">
        <header>
          <Card className="bg-light">
            <CardBody>
              <h2>
                {
                  shortUrl.visitsCount &&
                  <span className="badge badge-main float-right">Visits: {shortUrl.visitsCount}</span>
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
                Long URL:
                &nbsp;
                {loading && <small>Loading...</small>}
                {!loading && <a target="_blank" href={shortUrl.longUrl}>{shortUrl.longUrl}</a>}
              </div>
            </CardBody>
          </Card>
        </header>

        <section className="mt-4">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 offset-xl-6 offset-lg-4">
              <DateInput
                selected={this.state.startDate}
                placeholderText="Since"
                isClearable
                onChange={date => this.setState({ startDate: date }, () => this.loadVisits())}
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <DateInput
                selected={this.state.endDate}
                placeholderText="Until"
                isClearable
                onChange={date => this.setState({ endDate: date }, () => this.loadVisits())}
                className="short-url-visits__date-input"
              />
            </div>
          </div>
        </section>

        <section>
          {renderContent()}
        </section>
      </div>
    );
  }
}

ShortUrlsVisits.defaultProps = defaultProps;

export default connect(pick(['selectedServer', 'shortUrlVisits']), { getShortUrlVisits })(ShortUrlsVisits);
