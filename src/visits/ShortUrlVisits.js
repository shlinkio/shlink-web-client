import { faCircleNotch as preloader } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty, mapObjIndexed } from 'ramda';
import React from 'react';
import { Card } from 'reactstrap';
import PropTypes from 'prop-types';
import DateInput from '../utils/DateInput';
import MutedMessage from '../utils/MuttedMessage';
import SortableBarGraph from './SortableBarGraph';
import { shortUrlVisitsType } from './reducers/shortUrlVisits';
import { VisitsHeader } from './VisitsHeader';
import GraphCard from './GraphCard';
import { shortUrlDetailType } from './reducers/shortUrlDetail';
import './ShortUrlVisits.scss';

const ShortUrlVisits = ({
  processOsStats,
  processBrowserStats,
  processCountriesStats,
  processReferrersStats,
}) => class ShortUrlVisits extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    getShortUrlVisits: PropTypes.func,
    shortUrlVisits: shortUrlVisitsType,
    getShortUrlDetail: PropTypes.func,
    shortUrlDetail: shortUrlDetailType,
  };

  state = { startDate: undefined, endDate: undefined };
  loadVisits = () => {
    const { match: { params }, getShortUrlVisits } = this.props;

    getShortUrlVisits(params.shortCode, mapObjIndexed(
      (value) => value && value.format ? value.format('YYYY-MM-DD') : value,
      this.state
    ));
  };

  componentDidMount() {
    const { match: { params }, getShortUrlDetail } = this.props;

    this.loadVisits();
    getShortUrlDetail(params.shortCode);
  }

  render() {
    const { shortUrlVisits, shortUrlDetail } = this.props;

    const renderVisitsContent = () => {
      const { visits, loading, error } = shortUrlVisits;

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
        return <MutedMessage>There are no visits matching current filter  :(</MutedMessage>;
      }

      return (
        <div className="row">
          <div className="col-md-6">
            <GraphCard title="Operating systems" stats={processOsStats(visits)} />
          </div>
          <div className="col-md-6">
            <GraphCard title="Browsers" stats={processBrowserStats(visits)} />
          </div>
          <div className="col-md-6">
            <SortableBarGraph
              stats={processCountriesStats(visits)}
              title="Countries"
              sortingItems={{
                name: 'Country name',
                amount: 'Visits amount',
              }}
            />
          </div>
          <div className="col-md-6">
            <SortableBarGraph
              stats={processReferrersStats(visits)}
              title="Referrers"
              sortingItems={{
                name: 'Referrer name',
                amount: 'Visits amount',
              }}
            />
          </div>
        </div>
      );
    };

    return (
      <div className="shlink-container">
        <VisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} />

        <section className="mt-4">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 offset-xl-6 offset-lg-4">
              <DateInput
                selected={this.state.startDate}
                placeholderText="Since"
                isClearable
                maxDate={this.state.endDate}
                onChange={(date) => this.setState({ startDate: date }, () => this.loadVisits())}
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <DateInput
                className="short-url-visits__date-input"
                selected={this.state.endDate}
                placeholderText="Until"
                isClearable
                minDate={this.state.startDate}
                onChange={(date) => this.setState({ endDate: date }, () => this.loadVisits())}
              />
            </div>
          </div>
        </section>

        <section>
          {renderVisitsContent()}
        </section>
      </div>
    );
  }
};

export default ShortUrlVisits;
