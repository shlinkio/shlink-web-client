import { isEmpty, propEq, values } from 'ramda';
import { useState, useEffect, useMemo, FC } from 'react';
import { Button, Card, Nav, NavLink, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkedAlt, faList, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Route, Switch, NavLink as RouterNavLink, Redirect } from 'react-router-dom';
import { Location } from 'history';
import { DateRangeSelector } from '../utils/dates/DateRangeSelector';
import Message from '../utils/Message';
import { formatIsoDate } from '../utils/helpers/date';
import { ShlinkVisitsParams } from '../utils/services/types';
import { DateInterval, DateRange, intervalToDateRange } from '../utils/dates/types';
import { Result } from '../utils/Result';
import SortableBarGraph from './helpers/SortableBarGraph';
import GraphCard from './helpers/GraphCard';
import LineChartCard from './helpers/LineChartCard';
import VisitsTable from './VisitsTable';
import { NormalizedVisit, Stats, VisitsInfo } from './types';
import OpenMapModalBtn from './helpers/OpenMapModalBtn';
import { normalizeVisits, processStatsFromVisits } from './services/VisitsParser';
import './VisitsStats.scss';

export interface VisitsStatsProps {
  getVisits: (params: Partial<ShlinkVisitsParams>) => void;
  visitsInfo: VisitsInfo;
  cancelGetVisits: () => void;
  baseUrl: string;
  domain?: string;
}

interface VisitsNavLinkProps {
  title: string;
  subPath: string;
  icon: IconDefinition;
}

type HighlightableProps = 'referer' | 'country' | 'city';
type Section = 'byTime' | 'byContext' | 'byLocation' | 'list';

const sections: Record<Section, VisitsNavLinkProps> = {
  byTime: { title: 'By time', subPath: '', icon: faCalendarAlt },
  byContext: { title: 'By context', subPath: '/by-context', icon: faChartPie },
  byLocation: { title: 'By location', subPath: '/by-location', icon: faMapMarkedAlt },
  list: { title: 'List', subPath: '/list', icon: faList },
};

const highlightedVisitsToStats = (
  highlightedVisits: NormalizedVisit[],
  prop: HighlightableProps,
): Stats => highlightedVisits.reduce<Stats>((acc, highlightedVisit) => {
  if (!acc[highlightedVisit[prop]]) {
    acc[highlightedVisit[prop]] = 0;
  }

  acc[highlightedVisit[prop]] += 1;

  return acc;
}, {});
let selectedBar: string | undefined;
const initialInterval: DateInterval = 'last30Days';

const VisitsNavLink: FC<VisitsNavLinkProps> = ({ subPath, title, icon, children }) => (
  <NavLink
    tag={RouterNavLink}
    className="visits-stats__nav-link"
    to={children}
    isActive={(_: null, { pathname }: Location) => pathname.endsWith(`/visits${subPath}`)}
    replace
  >
    <FontAwesomeIcon icon={icon} />
    <span className="ml-2 d-none d-sm-inline">{title}</span>
  </NavLink>
);

const VisitsStats: FC<VisitsStatsProps> = ({ children, visitsInfo, getVisits, cancelGetVisits, baseUrl, domain }) => {
  const [ dateRange, setDateRange ] = useState<DateRange>(intervalToDateRange(initialInterval));
  const [ highlightedVisits, setHighlightedVisits ] = useState<NormalizedVisit[]>([]);
  const [ highlightedLabel, setHighlightedLabel ] = useState<string | undefined>();

  const buildSectionUrl = (subPath?: string) => {
    const query = domain ? `?domain=${domain}` : '';

    return !subPath ? `${baseUrl}${query}` : `${baseUrl}${subPath}${query}`;
  };
  const { visits, loading, loadingLarge, error, progress } = visitsInfo;
  const normalizedVisits = useMemo(() => normalizeVisits(visits), [ visits ]);
  const { os, browsers, referrers, countries, cities, citiesForMap } = useMemo(
    () => processStatsFromVisits(normalizedVisits),
    [ normalizedVisits ],
  );
  const mapLocations = values(citiesForMap);

  const setSelectedVisits = (selectedVisits: NormalizedVisit[]) => {
    selectedBar = undefined;
    setHighlightedVisits(selectedVisits);
  };
  const highlightVisitsForProp = (prop: HighlightableProps) => (value: string) => {
    const newSelectedBar = `${prop}_${value}`;

    if (selectedBar === newSelectedBar) {
      setHighlightedVisits([]);
      setHighlightedLabel(undefined);
      selectedBar = undefined;
    } else {
      setHighlightedVisits(normalizedVisits.filter(propEq(prop, value)));
      setHighlightedLabel(value);
      selectedBar = newSelectedBar;
    }
  };

  useEffect(() => cancelGetVisits, []);
  useEffect(() => {
    const { startDate, endDate } = dateRange;

    getVisits({ startDate: formatIsoDate(startDate) ?? undefined, endDate: formatIsoDate(endDate) ?? undefined });
  }, [ dateRange ]);

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
      return <Result type="error">An error occurred while loading visits :(</Result>;
    }

    if (isEmpty(visits)) {
      return <Message>There are no visits matching current filter  :(</Message>;
    }

    return (
      <>
        <Card className="visits-stats__nav p-0 overflow-hidden" body>
          <Nav pills justified>
            {Object.entries(sections).map(([ section, props ]) =>
              <VisitsNavLink key={section} {...props}>{buildSectionUrl(props.subPath)}</VisitsNavLink>)}
          </Nav>
        </Card>
        <div className="row">
          <Switch>
            <Route exact path={baseUrl}>
              <div className="col-12 mt-4">
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
              <div className="col-xl-4 col-lg-6 mt-4">
                <GraphCard title="Operating systems" stats={os} />
              </div>
              <div className="col-xl-4 col-lg-6 mt-4">
                <GraphCard title="Browsers" stats={browsers} />
              </div>
              <div className="col-xl-4 mt-4">
                <SortableBarGraph
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
            </Route>

            <Route exact path={`${baseUrl}${sections.byLocation.subPath}`}>
              <div className="col-lg-6 mt-4">
                <SortableBarGraph
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
              <div className="col-lg-6 mt-4">
                <SortableBarGraph
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
                />
              </div>
            </Route>

            <Redirect to={baseUrl} />
          </Switch>
        </div>
      </>
    );
  };

  return (
    <>
      {children}

      <section className="mt-4">
        <div className="row flex-md-row-reverse">
          <div className="col-lg-7 col-xl-6">
            <DateRangeSelector
              disabled={loading}
              initialDateRange={initialInterval}
              defaultText="All visits"
              onDatesChange={setDateRange}
            />
          </div>
          {visits.length > 0 && (
            <div className="col-lg-5 col-xl-6 mt-4 mt-lg-0">
              <Button
                outline
                disabled={highlightedVisits.length === 0}
                className="btn-md-block"
                onClick={() => setSelectedVisits([])}
              >
                Clear selection {highlightedVisits.length > 0 && <>({highlightedVisits.length})</>}
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="mt-4">
        {renderVisitsContent()}
      </section>
    </>
  );
};

export default VisitsStats;
