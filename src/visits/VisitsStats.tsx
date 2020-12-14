import { isEmpty, propEq, values } from 'ramda';
import { useState, useEffect, useMemo, FC } from 'react';
import { Button, Card, Nav, NavLink, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkedAlt, faList, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import moment from 'moment';
import { DateRangeSelector } from '../utils/dates/DateRangeSelector';
import Message from '../utils/Message';
import { formatDate } from '../utils/helpers/date';
import { ShlinkVisitsParams } from '../utils/services/types';
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
}

type HighlightableProps = 'referer' | 'country' | 'city';
type Section = 'byTime' | 'byContext' | 'byLocation' | 'list';

const sections: Record<Section, { title: string; icon: IconDefinition }> = {
  byTime: { title: 'By time', icon: faCalendarAlt },
  byContext: { title: 'By context', icon: faChartPie },
  byLocation: { title: 'By location', icon: faMapMarkedAlt },
  list: { title: 'List', icon: faList },
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
const format = formatDate();
let selectedBar: string | undefined;

const VisitsStats: FC<VisitsStatsProps> = ({ children, visitsInfo, getVisits, cancelGetVisits }) => {
  const [ startDate, setStartDate ] = useState<moment.Moment | null>(null);
  const [ endDate, setEndDate ] = useState<moment.Moment | null>(null);
  const [ highlightedVisits, setHighlightedVisits ] = useState<NormalizedVisit[]>([]);
  const [ highlightedLabel, setHighlightedLabel ] = useState<string | undefined>();
  const [ activeSection, setActiveSection ] = useState<Section>('byTime');
  const onSectionChange = (section: Section) => () => setActiveSection(section);

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

  useEffect(() => () => cancelGetVisits(), []);
  useEffect(() => {
    getVisits({ startDate: format(startDate) ?? undefined, endDate: format(endDate) ?? undefined });
  }, [ startDate, endDate ]);

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
        <Card className="mt-4" body inverse color="danger">
          An error occurred while loading visits :(
        </Card>
      );
    }

    if (isEmpty(visits)) {
      return <Message>There are no visits matching current filter  :(</Message>;
    }

    return (
      <>
        <Card className="visits-stats__nav p-0 mt-4 overflow-hidden" body>
          <Nav pills justified>
            {Object.entries(sections).map(
              ([ section, { title, icon }]) => (
                <NavLink
                  key={section}
                  active={activeSection === section}
                  className="visits-stats__nav-link"
                  onClick={onSectionChange(section as Section)}
                >
                  <FontAwesomeIcon icon={icon} />
                  <span className="ml-2 d-none d-sm-inline">{title}</span>
                </NavLink>
              ),
            )}
          </Nav>
        </Card>
        <div className="row">
          {activeSection === 'byTime' && (
            <div className="col-12 mt-4">
              <LineChartCard
                title="Visits during time"
                visits={normalizedVisits}
                highlightedVisits={highlightedVisits}
                highlightedLabel={highlightedLabel}
                setSelectedVisits={setSelectedVisits}
              />
            </div>
          )}
          {activeSection === 'byContext' && (
            <>
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
            </>
          )}
          {activeSection === 'byLocation' && (
            <>
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
            </>
          )}
          {activeSection === 'list' && (
            <div className="col-12">
              <VisitsTable
                visits={normalizedVisits}
                selectedVisits={highlightedVisits}
                setSelectedVisits={setSelectedVisits}
                isSticky
              />
            </div>
          )}
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
              onDatesChange={({ startDate: newStartDate, endDate: newEndDate }) => {
                setStartDate(newStartDate ?? null);
                setEndDate(newEndDate ?? null);
              }}
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
                Reset selection {highlightedVisits.length > 0 && <>({highlightedVisits.length})</>}
              </Button>
            </div>
          )}
        </div>
      </section>

      <section>
        {renderVisitsContent()}
      </section>
    </>
  );
};

export default VisitsStats;
