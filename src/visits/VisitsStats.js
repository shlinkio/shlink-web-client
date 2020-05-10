import { isEmpty, propEq, values } from 'ramda';
import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card, Collapse } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown as chevronDown } from '@fortawesome/free-solid-svg-icons';
import DateRangeRow from '../utils/DateRangeRow';
import Message from '../utils/Message';
import { formatDate } from '../utils/helpers/date';
import { useToggle } from '../utils/helpers/hooks';
import SortableBarGraph from './SortableBarGraph';
import GraphCard from './GraphCard';
import VisitsTable from './VisitsTable';
import { VisitsInfoType } from './types';

const propTypes = {
  children: PropTypes.node,
  getVisits: PropTypes.func,
  visitsInfo: VisitsInfoType,
  cancelGetVisits: PropTypes.func,
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
let selectedBar;

const VisitsStats = ({ processStatsFromVisits, normalizeVisits }, OpenMapModalBtn) => {
  const VisitsStatsComp = ({ children, visitsInfo, getVisits, cancelGetVisits, matchMedia = window.matchMedia }) => {
    const [ startDate, setStartDate ] = useState(undefined);
    const [ endDate, setEndDate ] = useState(undefined);
    const [ showTable, toggleTable ] = useToggle();
    const [ tableIsSticky, , setSticky, unsetSticky ] = useToggle();
    const [ highlightedVisits, setHighlightedVisits ] = useState([]);
    const [ isMobileDevice, setIsMobileDevice ] = useState(false);
    const determineIsMobileDevice = () => setIsMobileDevice(matchMedia('(max-width: 991px)').matches);
    const setSelectedVisits = (selectedVisits) => {
      selectedBar = undefined;
      setHighlightedVisits(selectedVisits);
    };
    const highlightVisitsForProp = (prop) => (value) => {
      const newSelectedBar = `${prop}_${value}`;

      if (selectedBar === newSelectedBar) {
        setHighlightedVisits([]);
        selectedBar = undefined;
      } else {
        setHighlightedVisits(normalizedVisits.filter(propEq(prop, value)));
        selectedBar = newSelectedBar;
      }
    };

    const { visits, loading, loadingLarge, error } = visitsInfo;
    const showTableControls = !loading && visits.length > 0;
    const normalizedVisits = useMemo(() => normalizeVisits(visits), [ visits ]);
    const { os, browsers, referrers, countries, cities, citiesForMap } = useMemo(
      () => processStatsFromVisits(normalizedVisits),
      [ normalizedVisits ]
    );
    const mapLocations = values(citiesForMap);

    useEffect(() => {
      determineIsMobileDevice();
      window.addEventListener('resize', determineIsMobileDevice);

      return () => {
        cancelGetVisits();
        window.removeEventListener('resize', determineIsMobileDevice);
      };
    }, []);
    useEffect(() => {
      getVisits({ startDate: format(startDate), endDate: format(endDate) });
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
        {children}

        <section className="mt-4">
          <div className="row flex-md-row-reverse">
            <div className="col-lg-7 col-xl-6">
              <DateRangeRow
                disabled={loading}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </div>
            <div className="col-lg-5 col-xl-6 mt-4 mt-lg-0">
              {showTableControls && (
                <span className={classNames({ row: isMobileDevice })}>
                  <span className={classNames({ 'col-6': isMobileDevice })}>
                    <Button outline color="primary" block={isMobileDevice} onClick={toggleTable}>
                      {showTable ? 'Hide' : 'Show'} table
                      <FontAwesomeIcon icon={chevronDown} rotation={showTable ? 180 : undefined} className="ml-2" />
                    </Button>
                  </span>
                  <span className={classNames({ 'col-6': isMobileDevice, 'ml-2': !isMobileDevice })}>
                    <Button
                      outline
                      disabled={highlightedVisits.length === 0}
                      block={isMobileDevice}
                      onClick={() => setSelectedVisits([])}
                    >
                      Reset selection
                    </Button>
                  </span>
                </span>
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
              setSelectedVisits={setSelectedVisits}
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

  VisitsStatsComp.propTypes = propTypes;

  return VisitsStatsComp;
};

export default VisitsStats;
