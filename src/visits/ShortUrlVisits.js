import { isEmpty, mapObjIndexed, values } from 'ramda';
import React from 'react';
import { Button, Card, Collapse } from 'reactstrap';
import PropTypes from 'prop-types';
import qs from 'qs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown as chevronDown } from '@fortawesome/free-solid-svg-icons';
import DateRangeRow from '../utils/DateRangeRow';
import Message from '../utils/Message';
import { formatDate } from '../utils/helpers/date';
import SortableBarGraph from './SortableBarGraph';
import { shortUrlVisitsType } from './reducers/shortUrlVisits';
import VisitsHeader from './VisitsHeader';
import GraphCard from './GraphCard';
import { shortUrlDetailType } from './reducers/shortUrlDetail';
import VisitsTable from './VisitsTable';

const highlightedVisitToStats = (highlightedVisit, prop) => highlightedVisit && { [highlightedVisit[prop]]: 1 };

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
    matchMedia: PropTypes.func,
  };

  state = {
    startDate: undefined,
    endDate: undefined,
    showTable: false,
    tableIsSticky: false,
    isMobileDevice: false,
    highlightedVisit: undefined,
  };

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

  setIsMobileDevice = () => {
    const { matchMedia = window.matchMedia } = this.props;

    this.setState({ isMobileDevice: matchMedia('(max-width: 991px)').matches });
  };

  componentDidMount() {
    this.timeWhenMounted = new Date().getTime();
    this.loadVisits(true);
    this.setIsMobileDevice();
    window.addEventListener('resize', this.setIsMobileDevice);
  }

  componentWillUnmount() {
    this.props.cancelGetShortUrlVisits();
    window.removeEventListener('resize', this.setIsMobileDevice);
  }

  render() {
    const { shortUrlVisits, shortUrlDetail } = this.props;
    const { visits, loading, loadingLarge, error } = shortUrlVisits;
    const showTableControls = !loading && visits.length > 0;

    const renderVisitsContent = () => {
      if (loading) {
        const message = loadingLarge ? 'This is going to take a while... :S' : 'Loading...';

        return <Message loading>{message}</Message>;
      }

      if (error) {
        return (
          <Card className="mt-4" body inverse color="danger">
            An error occurred while loading visits :(
          </Card>
        );
      }

      if (isEmpty(visits)) {
        return <Message>There are no visits matching current filter  :(</Message>;
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
              title="Referrers"
              stats={referrers}
              withPagination={false}
              highlightedStats={highlightedVisitToStats(this.state.highlightedVisit, 'referer')}
              sortingItems={{
                name: 'Referrer name',
                amount: 'Visits amount',
              }}
            />
          </div>
          <div className="col-lg-6">
            <SortableBarGraph
              title="Countries"
              stats={countries}
              highlightedStats={highlightedVisitToStats(this.state.highlightedVisit, 'country')}
              sortingItems={{
                name: 'Country name',
                amount: 'Visits amount',
              }}
            />
          </div>
          <div className="col-lg-6">
            <SortableBarGraph
              title="Cities"
              stats={cities}
              highlightedStats={highlightedVisitToStats(this.state.highlightedVisit, 'city')}
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
          <div className="row flex-md-row-reverse">
            <div className="col-lg-8 col-xl-6">
              <DateRangeRow
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onStartDateChange={setDate('startDate')}
                onEndDateChange={setDate('endDate')}
              />
            </div>
            <div className="col-lg-4 col-xl-6 mt-4 mt-lg-0">
              {showTableControls && (
                <Button
                  outline
                  block={this.state.isMobileDevice}
                  onClick={() => this.setState(({ showTable }) => ({ showTable: !showTable }))}
                >
                  Show table <FontAwesomeIcon icon={chevronDown} rotation={this.state.showTable ? 180 : undefined} />
                </Button>
              )}
            </div>
          </div>
        </section>

        {showTableControls && (
          <Collapse
            isOpen={this.state.showTable}

            // Enable stickiness only when there's no CSS animation, to avoid weird rendering effects
            onEntered={() => this.setState({ tableIsSticky: true })}
            onExiting={() => this.setState({ tableIsSticky: false })}
          >
            <VisitsTable
              visits={visits}
              isSticky={this.state.tableIsSticky}
              onVisitSelected={(highlightedVisit) => this.setState({ highlightedVisit })}
            />
          </Collapse>
        )}

        <section>
          {renderVisitsContent()}
        </section>
      </React.Fragment>
    );
  }
};

export default ShortUrlVisits;
