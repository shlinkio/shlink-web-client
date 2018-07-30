import React from 'react';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { pick } from 'ramda';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { getShortUrlVisits } from './reducers/shortUrlVisits';
import VisitsParser from '../visits/services/VisitsParser';

export class ShortUrlsVisits extends React.Component {
  state = { startDate: '', endDate: '' };

  componentDidMount() {
    const { match: { params } } = this.props;
    this.props.getShortUrlVisits(params.shortCode, this.state);
  }

  render() {
    const { match: { params }, selectedServer, visitsParser, shortUrlVisits } = this.props;
    const serverUrl = selectedServer ? selectedServer.url : '';
    const shortUrl = `${serverUrl}/${params.shortCode}`;
    const generateGraphData = stats => ({
      labels: Object.keys(stats),
      datasets: Object.values(stats)
    });

    return (
      <div className="short-urls-container">
        <Card className="bg-light">
          <CardBody>
            <h2>Visit stats for <a target="_blank" href={shortUrl}>{shortUrl}</a></h2>
          </CardBody>
        </Card>

        <div className="row">
          <div className="col-md-6">
            <Card className="mt-4">
              <CardHeader>Operating systems</CardHeader>
              <CardBody>
                <Doughnut data={generateGraphData(visitsParser.processOsStats(shortUrlVisits))} />
              </CardBody>
            </Card>
          </div>
          <div className="col-md-6">
            <Card className="mt-4">
              <CardHeader>Browsers</CardHeader>
              <CardBody>
                <Doughnut data={generateGraphData(visitsParser.processBrowserStats(shortUrlVisits))} />
              </CardBody>
            </Card>
          </div>
          <div className="col-md-6">
            <Card className="mt-4">
              <CardHeader>Countries</CardHeader>
              <CardBody>
                <HorizontalBar data={generateGraphData(visitsParser.processCountriesStats(shortUrlVisits))} />
              </CardBody>
            </Card>
          </div>
          <div className="col-md-6">
            <Card className="mt-4">
              <CardHeader>Referrers</CardHeader>
              <CardBody>
                <HorizontalBar data={generateGraphData(visitsParser.processReferrersStats(shortUrlVisits))} />
              </CardBody>
            </Card>
          </div>
        </div>
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
