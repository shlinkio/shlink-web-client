import { isEmpty, mapObjIndexed, values } from 'ramda';
import React from 'react';
import { Card } from 'reactstrap';
import PropTypes from 'prop-types';
import qs from 'qs';
import DateRangeRow from '../utils/DateRangeRow';
import MutedMessage from '../utils/MutedMessage';
import { formatDate } from '../utils/utils';
import SortableBarGraph from './SortableBarGraph';
import { shortUrlVisitsType } from './reducers/shortUrlVisits';
import VisitsHeader from './VisitsHeader';
import GraphCard from './GraphCard';
import { shortUrlDetailType } from './reducers/shortUrlDetail';

const ShortUrlVisits = (
  { processStatsFromVisits },
  OpenMapModalBtn
) => class ShortUrlVisits extends React.PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
    getShortUrlVisits: PropTypes.func,
    shortUrlVisits: shortUrlVisitsType,
    getShortUrlDetail: PropTypes.func,
    shortUrlDetail: shortUrlDetailType,
    cancelGetShortUrlVisits: PropTypes.func,
  };

  state = { startDate: undefined, endDate: undefined };
  loadVisits = (loadDetail = false) => {
    const { match: { params }, location: { search }, getShortUrlVisits, getShortUrlDetail } = this.props;
    const { shortCode } = params;
    const { startDate, endDate } = mapObjIndexed(formatDate(), this.state);
    const { domain } = qs.parse(search, { ignoreQueryPrefix: true });

    // While the "page" is loaded, use the timestamp + filtering dates as memoization IDs for stats calculations
    this.memoizationId = `${this.timeWhenMounted}_${shortCode}_${startDate}_${endDate}`;
    getShortUrlVisits(shortCode, { startDate, endDate, domain });

    if (loadDetail) {
      getShortUrlDetail(shortCode, domain);
    }
  };

  componentDidMount() {
    this.timeWhenMounted = new Date().getTime();
    this.loadVisits(true);
  }

  componentWillUnmount() {
    this.props.cancelGetShortUrlVisits();
  }

  render() {
    const { shortUrlVisits, shortUrlDetail } = this.props;

    const renderVisitsContent = () => {
      const { visits, loading, loadingLarge, error } = shortUrlVisits;

      if (loading) {
        const message = loadingLarge ? 'This is going to take a while... :S' : 'Loading...';

        return <MutedMessage loading>{message}</MutedMessage>;
      }

      if (error) {
        return (
          <Card className="mt-4" body inverse color="danger">
            An error occurred while loading visits :(
          </Card>
        );
      }

      if (isEmpty(visits)) {
        return <MutedMessage>There are no visits matching current filter  :(</MutedMessage>;
      }

      const { os, browsers, referrers, countries, cities, citiesForMap } = processStatsFromVisits(
        { id: this.memoizationId, visits }
      );
      const mapLocations = values(citiesForMap);

      return (
        <div className="row">
          <div className="col-xl-4 col-lg-6">
            <GraphCard title="Operating systems" stats={os} />
          </div>
          <div className="col-xl-4 col-lg-6">
            <GraphCard title="Browsers" stats={browsers} />
          </div>
          <div className="col-xl-4">
            <SortableBarGraph
              stats={referrers}
              withPagination={false}
              title="Referrers"
              sortingItems={{
                name: 'Referrer name',
                amount: 'Visits amount',
              }}
            />
          </div>
          <div className="col-lg-6">
            <SortableBarGraph
              stats={countries}
              title="Countries"
              sortingItems={{
                name: 'Country name',
                amount: 'Visits amount',
              }}
            />
          </div>
          <div className="col-lg-6">
            <SortableBarGraph
              stats={cities}
              title="Cities"
              extraHeaderContent={(activeCities) =>
                mapLocations.length > 0 &&
                  <OpenMapModalBtn modalTitle="Cities" locations={mapLocations} activeCities={activeCities} />
              }
              sortingItems={{
                name: 'City name',
                amount: 'Visits amount',
              }}
            />
          </div>
        </div>
      );
    };
    const setDate = (dateField) => (date) => this.setState({ [dateField]: date }, this.loadVisits);

    return (
      <React.Fragment>
        <VisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} />

        <section className="mt-4">
          <DateRangeRow
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onStartDateChange={setDate('startDate')}
            onEndDateChange={setDate('endDate')}
          />
        </section>

        <section>
          {renderVisitsContent()}
        </section>
      </React.Fragment>
    );
  }
};

export default ShortUrlVisits;
