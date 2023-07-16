import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCalendarAlt, faChartPie, faList, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { isEmpty, pipe, propEq, values } from 'ramda';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Button, Progress, Row } from 'reactstrap';
import { ShlinkApiError } from '../../api/ShlinkApiError';
import type { Settings } from '../../settings/reducers/settings';
import { DateRangeSelector } from '../../utils/dates/DateRangeSelector';
import { ExportBtn } from '../../utils/ExportBtn';
import type { DateInterval, DateRange } from '../../utils/helpers/dateIntervals';
import { toDateRange } from '../../utils/helpers/dateIntervals';
import { prettify } from '../../utils/helpers/numbers';
import { Message } from '../../utils/Message';
import { NavPillItem, NavPills } from '../../utils/NavPills';
import { Result } from '../../utils/Result';
import { DoughnutChartCard } from './charts/DoughnutChartCard';
import { LineChartCard } from './charts/LineChartCard';
import { SortableBarChartCard } from './charts/SortableBarChartCard';
import { useVisitsQuery } from './helpers/hooks';
import { OpenMapModalBtn } from './helpers/OpenMapModalBtn';
import { VisitsFilterDropdown } from './helpers/VisitsFilterDropdown';
import type { VisitsInfo } from './reducers/types';
import { normalizeVisits, processStatsFromVisits } from './services/VisitsParser';
import type { NormalizedOrphanVisit, NormalizedVisit, VisitsParams } from './types';
import type { HighlightableProps } from './types/helpers';
import { highlightedVisitsToStats } from './types/helpers';
import { VisitsTable } from './VisitsTable';

export type VisitsStatsProps = PropsWithChildren<{
  getVisits: (params: VisitsParams, doIntervalFallback?: boolean) => void;
  visitsInfo: VisitsInfo;
  settings: Settings;
  cancelGetVisits: () => void;
  exportCsv: (visits: NormalizedVisit[]) => void;
  isOrphanVisits?: boolean;
}>;

interface VisitsNavLinkProps {
  title: string;
  subPath: string;
  icon: IconDefinition;
}

type Section = 'byTime' | 'byContext' | 'byLocation' | 'list';

const sections: Record<Section, VisitsNavLinkProps> = {
  byTime: { title: 'By time', subPath: 'by-time', icon: faCalendarAlt },
  byContext: { title: 'By context', subPath: 'by-context', icon: faChartPie },
  byLocation: { title: 'By location', subPath: 'by-location', icon: faMapMarkedAlt },
  list: { title: 'List', subPath: 'list', icon: faList },
};

let selectedBar: string | undefined;

export const VisitsStats: FC<VisitsStatsProps> = ({
  children,
  visitsInfo,
  getVisits,
  cancelGetVisits,
  settings,
  exportCsv,
  isOrphanVisits = false,
}) => {
  const { visits, loading, loadingLarge, error, errorData, progress, fallbackInterval } = visitsInfo;
  const [{ dateRange, visitsFilter }, updateFiltering] = useVisitsQuery();
  const setDates = pipe(
    ({ startDate: theStartDate, endDate: theEndDate }: DateRange) => ({
      dateRange: {
        startDate: theStartDate ?? undefined,
        endDate: theEndDate ?? undefined,
      },
    }),
    updateFiltering,
  );
  const initialInterval = useRef<DateRange | DateInterval>(
    dateRange ?? fallbackInterval ?? settings.visits?.defaultInterval ?? 'last30Days',
  );
  const [highlightedVisits, setHighlightedVisits] = useState<NormalizedVisit[]>([]);
  const [highlightedLabel, setHighlightedLabel] = useState<string | undefined>();
  const isFirstLoad = useRef(true);
  const { search } = useLocation();

  const buildSectionUrl = (subPath?: string) => (!subPath ? search : `${subPath}${search}`);
  const normalizedVisits = useMemo(() => normalizeVisits(visits), [visits]);
  const { os, browsers, referrers, countries, cities, citiesForMap, visitedUrls } = useMemo(
    () => processStatsFromVisits(normalizedVisits),
    [normalizedVisits],
  );
  const resolvedFilter = useMemo(() => ({
    ...visitsFilter,
    excludeBots: visitsFilter.excludeBots ?? settings.visits?.excludeBots,
  }), [visitsFilter]);
  const mapLocations = values(citiesForMap);

  const setSelectedVisits = (selectedVisits: NormalizedVisit[]) => {
    selectedBar = undefined;
    setHighlightedVisits(selectedVisits);
  };
  const highlightVisitsForProp = (prop: HighlightableProps<NormalizedOrphanVisit>) => (value: string) => {
    const newSelectedBar = `${prop}_${value}`;

    if (selectedBar === newSelectedBar) {
      setHighlightedVisits([]);
      setHighlightedLabel(undefined);
      selectedBar = undefined;
    } else {
      setHighlightedVisits((normalizedVisits as NormalizedOrphanVisit[]).filter(propEq(prop, value)));
      setHighlightedLabel(value);
      selectedBar = newSelectedBar;
    }
  };

  useEffect(() => cancelGetVisits, []);
  useEffect(() => {
    const resolvedDateRange = !isFirstLoad.current ? dateRange : (dateRange ?? toDateRange(initialInterval.current));
    getVisits({ dateRange: resolvedDateRange, filter: resolvedFilter }, isFirstLoad.current);
    isFirstLoad.current = false;
  }, [dateRange, visitsFilter]);
  useEffect(() => {
    // As soon as the fallback is loaded, if the initial interval used the settings one, we do fall back
    if (fallbackInterval && initialInterval.current === (settings.visits?.defaultInterval ?? 'last30Days')) {
      initialInterval.current = fallbackInterval;
    }
  }, [fallbackInterval]);

  const renderVisitsContent = () => {
    if (loadingLarge) {
      return (
        <Message loading>
          This is going to take a while... :S
          <Progress value={progress} striped={progress === 100} className="mt-3" />
        </Message>
      );
    }

    if (loading) {
      return <Message loading />;
    }

    if (error) {
      return (
        <Result type="error">
          <ShlinkApiError errorData={errorData} fallbackMessage="An error occurred while loading visits :(" />
        </Result>
      );
    }

    if (isEmpty(visits)) {
      return <Message>There are no visits matching current filter</Message>;
    }

    return (
      <>
        <NavPills fill>
          {Object.values(sections).map(({ title, icon, subPath }, index) => (
            <NavPillItem key={index} to={buildSectionUrl(subPath)} replace>
              <FontAwesomeIcon icon={icon} />
              <span className="ms-2 d-none d-sm-inline">{title}</span>
            </NavPillItem>
          ))}
        </NavPills>
        <Row>
          <Routes>
            <Route
              path={sections.byTime.subPath}
              element={(
                <div className="col-12 mt-3">
                  <LineChartCard
                    title="Visits during time"
                    visits={normalizedVisits}
                    highlightedVisits={highlightedVisits}
                    highlightedLabel={highlightedLabel}
                    setSelectedVisits={setSelectedVisits}
                  />
                </div>
              )}
            />

            <Route
              path={sections.byContext.subPath}
              element={(
                <>
                  <div className={classNames('mt-3 col-lg-6', { 'col-xl-4': !isOrphanVisits })}>
                    <DoughnutChartCard title="Operating systems" stats={os} />
                  </div>
                  <div className={classNames('mt-3 col-lg-6', { 'col-xl-4': !isOrphanVisits })}>
                    <DoughnutChartCard title="Browsers" stats={browsers} />
                  </div>
                  <div className={classNames('mt-3', { 'col-xl-4': !isOrphanVisits, 'col-lg-6': isOrphanVisits })}>
                    <SortableBarChartCard
                      title="Referrers"
                      stats={referrers}
                      withPagination={false}
                      highlightedStats={highlightedVisitsToStats(highlightedVisits, 'referer')}
                      highlightedLabel={highlightedLabel}
                      sortingItems={{
                        name: 'Referrer name',
                        amount: 'Visits amount',
                      }}
                      onClick={highlightVisitsForProp('referer')}
                    />
                  </div>
                  {isOrphanVisits && (
                    <div className="mt-3 col-lg-6">
                      <SortableBarChartCard
                        title="Visited URLs"
                        stats={visitedUrls}
                        highlightedLabel={highlightedLabel}
                        highlightedStats={highlightedVisitsToStats(highlightedVisits, 'visitedUrl')}
                        sortingItems={{
                          visitedUrl: 'Visited URL',
                          amount: 'Visits amount',
                        }}
                        onClick={highlightVisitsForProp('visitedUrl')}
                      />
                    </div>
                  )}
                </>
              )}
            />

            <Route
              path={sections.byLocation.subPath}
              element={(
                <>
                  <div className="col-lg-6 mt-3">
                    <SortableBarChartCard
                      title="Countries"
                      stats={countries}
                      highlightedStats={highlightedVisitsToStats(highlightedVisits, 'country')}
                      highlightedLabel={highlightedLabel}
                      sortingItems={{
                        name: 'Country name',
                        amount: 'Visits amount',
                      }}
                      onClick={highlightVisitsForProp('country')}
                    />
                  </div>
                  <div className="col-lg-6 mt-3">
                    <SortableBarChartCard
                      title="Cities"
                      stats={cities}
                      highlightedStats={highlightedVisitsToStats(highlightedVisits, 'city')}
                      highlightedLabel={highlightedLabel}
                      extraHeaderContent={(activeCities) => mapLocations.length > 0 && (
                        <OpenMapModalBtn modalTitle="Cities" locations={mapLocations} activeCities={activeCities} />
                      )}
                      sortingItems={{
                        name: 'City name',
                        amount: 'Visits amount',
                      }}
                      onClick={highlightVisitsForProp('city')}
                    />
                  </div>
                </>
              )}
            />

            <Route
              path={sections.list.subPath}
              element={(
                <div className="col-12">
                  <VisitsTable
                    visits={normalizedVisits}
                    selectedVisits={highlightedVisits}
                    setSelectedVisits={setSelectedVisits}
                    isOrphanVisits={isOrphanVisits}
                  />
                </div>
              )}
            />

            <Route path="*" element={<Navigate replace to={buildSectionUrl(sections.byTime.subPath)} />} />
          </Routes>
        </Row>
      </>
    );
  };

  return (
    <>
      {children}

      <section className="mt-3">
        <div className="row flex-md-row-reverse">
          <div className="col-lg-7 col-xl-6">
            <div className="d-md-flex">
              <div className="flex-fill">
                <DateRangeSelector
                  updatable
                  disabled={loading}
                  initialDateRange={initialInterval.current}
                  defaultText="All visits"
                  onDatesChange={setDates}
                />
              </div>
              <VisitsFilterDropdown
                className="ms-0 ms-md-2 mt-3 mt-md-0"
                isOrphanVisits={isOrphanVisits}
                selected={resolvedFilter}
                onChange={(newVisitsFilter) => updateFiltering({ visitsFilter: newVisitsFilter })}
              />
            </div>
          </div>
          {visits.length > 0 && (
            <div className="col-lg-5 col-xl-6 mt-3 mt-lg-0">
              <div className="d-flex">
                <ExportBtn
                  className="btn-md-block"
                  amount={normalizedVisits.length}
                  onClick={() => exportCsv(normalizedVisits)}
                />
                <Button
                  outline
                  disabled={highlightedVisits.length === 0}
                  className="btn-md-block ms-2"
                  onClick={() => setSelectedVisits([])}
                >
                  Clear selection {highlightedVisits.length > 0 && <>({prettify(highlightedVisits.length)})</>}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-3">
        {renderVisitsContent()}
      </section>
    </>
  );
};
