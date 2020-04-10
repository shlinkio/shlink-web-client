import { isEmpty, propEq, values } from 'ramda';
import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card, Collapse } from 'reactstrap';
import PropTypes from 'prop-types';
import qs from 'qs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown as chevronDown } from '@fortawesome/free-solid-svg-icons';
import DateRangeRow from '../utils/DateRangeRow';
import Message from '../utils/Message';
import { formatDate } from '../utils/helpers/date';
import { useToggle } from '../utils/helpers/hooks';
import SortableBarGraph from './SortableBarGraph';
import { shortUrlVisitsType } from './reducers/shortUrlVisits';
import VisitsHeader from './VisitsHeader';
import GraphCard from './GraphCard';
import { shortUrlDetailType } from './reducers/shortUrlDetail';
import VisitsTable from './VisitsTable';

const propTypes = {
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

const highlightedVisitsToStats = (highlightedVisits, prop) => highlightedVisits.reduce((acc, highlightedVisit) => {
  if (!acc[highlightedVisit[prop]]) {
    acc[highlightedVisit[prop]] = 0;
  }

  acc[highlightedVisit[prop]] += 1;

  return acc;
}, {});
const format = formatDate();

const ShortUrlVisits = ({ processStatsFromVisits, normalizeVisits }, OpenMapModalBtn) => {
  const ShortUrlVisitsComp = ({
    match,
    location,
    shortUrlVisits,
    shortUrlDetail,
    getShortUrlVisits,
    getShortUrlDetail,
    cancelGetShortUrlVisits,
    matchMedia = window.matchMedia,
  }) => {
    const [ startDate, setStartDate ] = useState(undefined);
    const [ endDate, setEndDate ] = useState(undefined);
    const [ showTable, toggleTable ] = useToggle();
    const [ tableIsSticky, , setSticky, unsetSticky ] = useToggle();
    const [ highlightedVisits, setHighlightedVisits ] = useState([]);
    const [ isMobileDevice, setIsMobileDevice ] = useState(false);
    const determineIsMobileDevice = () => setIsMobileDevice(matchMedia('(max-width: 991px)').matches);
    const highlightVisitsForProp = (prop) => (value) => setHighlightedVisits(
      highlightedVisits.length === 0 ? normalizedVisits.filter(propEq(prop, value)) : []
    );

    const { params } = match;
    const { shortCode } = params;
    const { search } = location;
    const { domain } = qs.parse(search, { ignoreQueryPrefix: true });

    const { visits, loading, loadingLarge, error } = shortUrlVisits;
    const showTableControls = !loading && visits.length > 0;
    const normalizedVisits = useMemo(() => normalizeVisits(visits), [ visits ]);
    const { os, browsers, referrers, countries, cities, citiesForMap } = useMemo(
      () => processStatsFromVisits(visits),
      [ visits ]
    );
    const mapLocations = values(citiesForMap);

    const loadVisits = () =>
      getShortUrlVisits(shortCode, { startDate: format(startDate), endDate: format(endDate), domain });

    useEffect(() => {
      getShortUrlDetail(shortCode, domain);
      determineIsMobileDevice();
      window.addEventListener('resize', determineIsMobileDevice);

      return () => {
        cancelGetShortUrlVisits();
        window.removeEventListener('resize', determineIsMobileDevice);
      };
    }, []);
    useEffect(() => {
      loadVisits();
    }, [ startDate, endDate ]);

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
              highlightedStats={highlightedVisitsToStats(highlightedVisits, 'referer')}
              sortingItems={{
                name: 'Referrer name',
                amount: 'Visits amount',
              }}
              onClick={highlightVisitsForProp('referer')}
            />
          </div>
          <div className="col-lg-6">
            <SortableBarGraph
              title="Countries"
              stats={countries}
              highlightedStats={highlightedVisitsToStats(highlightedVisits, 'country')}
              sortingItems={{
                name: 'Country name',
                amount: 'Visits amount',
              }}
              onClick={highlightVisitsForProp('country')}
            />
          </div>
          <div className="col-lg-6">
            <SortableBarGraph
              title="Cities"
              stats={cities}
              highlightedStats={highlightedVisitsToStats(highlightedVisits, 'city')}
              extraHeaderContent={(activeCities) =>
                mapLocations.length > 0 &&
                <OpenMapModalBtn modalTitle="Cities" locations={mapLocations} activeCities={activeCities} />
              }
              sortingItems={{
                name: 'City name',
                amount: 'Visits amount',
              }}
              onClick={highlightVisitsForProp('city')}
            />
          </div>
        </div>
      );
    };

    return (
      <React.Fragment>
        <VisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} />

        <section className="mt-4">
          <div className="row flex-md-row-reverse">
            <div className="col-lg-8 col-xl-6">
              <DateRangeRow
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </div>
            <div className="col-lg-4 col-xl-6 mt-4 mt-lg-0">
              {showTableControls && (
                <Button outline block={isMobileDevice} onClick={toggleTable}>
                  {showTable ? 'Hide' : 'Show'} table{' '}
                  <FontAwesomeIcon icon={chevronDown} rotation={showTable ? 180 : undefined} />
                </Button>
              )}
            </div>
          </div>
        </section>

        {showTableControls && (
          <Collapse
            isOpen={showTable}
            // Enable stickiness only when there's no CSS animation, to avoid weird rendering effects
            onEntered={setSticky}
            onExiting={unsetSticky}
          >
            <VisitsTable
              visits={normalizedVisits}
              selectedVisits={highlightedVisits}
              setSelectedVisits={setHighlightedVisits}
              isSticky={tableIsSticky}
            />
          </Collapse>
        )}

        <section>
          {renderVisitsContent()}
        </section>
      </React.Fragment>
    );
  };

  ShortUrlVisitsComp.propTypes = propTypes;

  return ShortUrlVisitsComp;
};

export default ShortUrlVisits;
