import React from 'react';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { pick } from 'ramda';
import { Card, CardBody, CardHeader } from 'reactstrap';
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
    const { match: { params }, selectedServer, visitsParser, shortUrlVisits: { visits, loading, error } } = this.props;
    const serverUrl = selectedServer ? selectedServer.url : '';
    const shortUrl = `${serverUrl}/${params.shortCode}`;
    const generateGraphData = stats => ({
      labels: Object.keys(stats),
      data: Object.values(stats)
    });

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
          <div className="col-md-6">
            <Card className="mt-4">
              <CardHeader>Operating systems</CardHeader>
              <CardBody>
                <Doughnut data={generateGraphData(visitsParser.processOsStats(visits))} />
              </CardBody>
            </Card>
          </div>
          <div className="col-md-6">
            <Card className="mt-4">
              <CardHeader>Browsers</CardHeader>
              <CardBody>
                <Doughnut data={generateGraphData(visitsParser.processBrowserStats(visits))} />
              </CardBody>
            </Card>
          </div>
          <div className="col-md-6">
            <Card className="mt-4">
              <CardHeader>Countries</CardHeader>
              <CardBody>
                <HorizontalBar data={generateGraphData(visitsParser.processCountriesStats(visits))} />
              </CardBody>
            </Card>
          </div>
          <div className="col-md-6">
            <Card className="mt-4">
              <CardHeader>Referrers</CardHeader>
              <CardBody>
                <HorizontalBar data={generateGraphData(visitsParser.processReferrersStats(visits))} />
              </CardBody>
            </Card>
          </div>
        </div>
      );
    };

    return (
      <div className="short-urls-container">
        <Card className="bg-light">
          <CardBody>
            <h2>Visit stats for <a target="_blank" href={shortUrl}>{shortUrl}</a></h2>
          </CardBody>
        </Card>

        {renderContent()}
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
