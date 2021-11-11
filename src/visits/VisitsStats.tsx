import { isEmpty, propEq, values } from 'ramda';
import { useState, useEffect, useMemo, FC } from 'react';
import { Button, Card, Nav, NavLink, Progress, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkedAlt, faList, faChartPie, faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Route, Switch, NavLink as RouterNavLink, Redirect } from 'react-router-dom';
import { Location } from 'history';
import classNames from 'classnames';
import { DateRangeSelector } from '../utils/dates/DateRangeSelector';
import Message from '../utils/Message';
import { DateInterval, DateRange, intervalToDateRange } from '../utils/dates/types';
import { Result } from '../utils/Result';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { Settings } from '../settings/reducers/settings';
import { SelectedServer } from '../servers/data';
import { supportsBotVisits } from '../utils/helpers/features';
import { prettify } from '../utils/helpers/numbers';
import LineChartCard from './charts/LineChartCard';
import VisitsTable from './VisitsTable';
import { NormalizedOrphanVisit, NormalizedVisit, VisitsFilter, VisitsInfo, VisitsParams } from './types';
import OpenMapModalBtn from './helpers/OpenMapModalBtn';
import { normalizeVisits, processStatsFromVisits } from './services/VisitsParser';
import { VisitsFilterDropdown } from './helpers/VisitsFilterDropdown';
import { HighlightableProps, highlightedVisitsToStats } from './types/helpers';
import { DoughnutChartCard } from './charts/DoughnutChartCard';
import { SortableBarChartCard } from './charts/SortableBarChartCard';
import './VisitsStats.scss';

export interface VisitsStatsProps {
  getVisits: (params: VisitsParams) => void;
  visitsInfo: VisitsInfo;
  settings: Settings;
  selectedServer: SelectedServer;
  cancelGetVisits: () => void;
  baseUrl: string;
  domain?: string;
  exportCsv: (visits: NormalizedVisit[]) => void;
  isOrphanVisits?: boolean;
}

interface VisitsNavLinkProps {
  title: string;
  subPath: string;
  icon: IconDefinition;
}

type Section = 'byTime' | 'byContext' | 'byLocation' | 'list';

const sections: Record<Section, VisitsNavLinkProps> = {
  byTime: { title: 'By time', subPath: '', icon: faCalendarAlt },
  byContext: { title: 'By context', subPath: '/by-context', icon: faChartPie },
  byLocation: { title: 'By location', subPath: '/by-location', icon: faMapMarkedAlt },
  list: { title: 'List', subPath: '/list', icon: faList },
};

let selectedBar: string | undefined;

const VisitsNavLink: FC<VisitsNavLinkProps & { to: string }> = ({ subPath, title, icon, to }) => (
  <NavLink
    tag={RouterNavLink}
    className="visits-stats__nav-link"
    to={to}
    isActive={(_: null, { pathname }: Location) => pathname.endsWith(`visits${subPath}`)}
    replace
  >
    <FontAwesomeIcon icon={icon} />
    <span className="ml-2 d-none d-sm-inline">{title}</span>
  </NavLink>
);

const VisitsStats: FC<VisitsStatsProps> = ({
  children,
  visitsInfo,
  getVisits,
  cancelGetVisits,
  baseUrl,
  domain,
  settings,
  exportCsv,
  selectedServer,
  isOrphanVisits = false,
}) => {
  const initialInterval: DateInterval = settings.visits?.defaultInterval ?? 'last30Days';
  const [ dateRange, setDateRange ] = useState<DateRange>(intervalToDateRange(initialInterval));
  const [ highlightedVisits, setHighlightedVisits ] = useState<NormalizedVisit[]>([]);
  const [ highlightedLabel, setHighlightedLabel ] = useState<string | undefined>();
  const [ visitsFilter, setVisitsFilter ] = useState<VisitsFilter>({});
  const botsSupported = supportsBotVisits(selectedServer);

  const buildSectionUrl = (subPath?: string) => {
    const query = domain ? `?domain=${domain}` : '';

    return !subPath ? `${baseUrl}${query}` : `${baseUrl}${subPath}${query}`;
  };
  const { visits, loading, loadingLarge, error, errorData, progress } = visitsInfo;
  const normalizedVisits = useMemo(() => normalizeVisits(visits), [ visits ]);
  const { os, browsers, referrers, countries, cities, citiesForMap, visitedUrls } = useMemo(
    () => processStatsFromVisits(normalizedVisits),
    [ normalizedVisits ],
  );
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
    getVisits({ dateRange, filter: visitsFilter });
  }, [ dateRange, visitsFilter ]);

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
      return <Message>There are no visits matching current filter  :(</Message>;
    }

    return (
      <>
        <Card className="visits-stats__nav p-0 overflow-hidden" body>
          <Nav pills fill>
            {Object.entries(sections).map(([ section, props ]) =>
              <VisitsNavLink key={section} {...props} to={buildSectionUrl(props.subPath)} />)}
          </Nav>
        </Card>
        <Row>
          <Switch>
            <Route exact path={baseUrl}>
              <div className="col-12 mt-3">
                <LineChartCard
                  title="Visits during time"
                  visits={normalizedVisits}
                  highlightedVisits={highlightedVisits}
                  highlightedLabel={highlightedLabel}
                  setSelectedVisits={setSelectedVisits}
                />
              </div>
            </Route>

            <Route exact path={`${baseUrl}${sections.byContext.subPath}`}>
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
            </Route>

            <Route exact path={`${baseUrl}${sections.byLocation.subPath}`}>
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
                  extraHeaderContent={(activeCities: string[]) =>
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
            </Route>

            <Route exact path={`${baseUrl}${sections.list.subPath}`}>
              <div className="col-12">
                <VisitsTable
                  visits={normalizedVisits}
                  selectedVisits={highlightedVisits}
                  setSelectedVisits={setSelectedVisits}
                  isOrphanVisits={isOrphanVisits}
                  selectedServer={selectedServer}
                />
              </div>
            </Route>

            <Redirect to={baseUrl} />
          </Switch>
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
                  disabled={loading}
                  initialDateRange={initialInterval}
                  defaultText="All visits"
                  onDatesChange={setDateRange}
                />
              </div>
              <VisitsFilterDropdown
                className="ml-0 ml-md-2 mt-3 mt-md-0"
                isOrphanVisits={isOrphanVisits}
                botsSupported={botsSupported}
                selected={visitsFilter}
                onChange={setVisitsFilter}
              />
            </div>
          </div>
          {visits.length > 0 && (
            <div className="col-lg-5 col-xl-6 mt-3 mt-lg-0">
              <div className="d-flex">
                <Button
                  outline
                  disabled={highlightedVisits.length === 0}
                  className="btn-md-block mr-2"
                  onClick={() => setSelectedVisits([])}
                >
                  Clear selection {highlightedVisits.length > 0 && <>({prettify(highlightedVisits.length)})</>}
                </Button>
                <Button
                  outline
                  color="primary"
                  className="btn-md-block"
                  onClick={() => exportCsv(normalizedVisits)}
                >
                  <FontAwesomeIcon icon={faFileDownload} /> Export ({prettify(normalizedVisits.length)})
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

export default VisitsStats;
