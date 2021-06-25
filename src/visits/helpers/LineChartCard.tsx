import { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Line } from 'react-chartjs-2';
import { always, cond, countBy, reverse } from 'ramda';
import {
  add,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  differenceInWeeks,
  parseISO,
  format,
  startOfISOWeek,
  endOfISOWeek,
} from 'date-fns';
import Chart, { ChartData, ChartDataSets, ChartOptions } from 'chart.js';
import { NormalizedVisit, Stats } from '../types';
import { fillTheGaps } from '../../utils/helpers/visits';
import { useToggle } from '../../utils/helpers/hooks';
import { rangeOf } from '../../utils/utils';
import ToggleSwitch from '../../utils/ToggleSwitch';
import { prettify } from '../../utils/helpers/numbers';
import { pointerOnHover, renderNonDoughnutChartLabel } from '../../utils/helpers/charts';
import { HIGHLIGHTED_COLOR, MAIN_COLOR } from '../../utils/theme';
import './LineChartCard.scss';

interface LineChartCardProps {
  title: string;
  highlightedLabel?: string;
  visits: NormalizedVisit[];
  highlightedVisits: NormalizedVisit[];
  setSelectedVisits?: (visits: NormalizedVisit[]) => void;
}

type Step = 'monthly' | 'weekly' | 'daily' | 'hourly';

const STEPS_MAP: Record<Step, string> = {
  monthly: 'Month',
  weekly: 'Week',
  daily: 'Day',
  hourly: 'Hour',
};

const STEP_TO_DURATION_MAP: Record<Step, Duration> = {
  hourly: { hours: 1 },
  daily: { days: 1 },
  weekly: { weeks: 1 },
  monthly: { months: 1 },
};

const STEP_TO_DIFF_FUNC_MAP: Record<Step, (dateLeft: Date, dateRight: Date) => number> = {
  hourly: differenceInHours,
  daily: differenceInDays,
  weekly: differenceInWeeks,
  monthly: differenceInMonths,
};

const STEP_TO_DATE_FORMAT: Record<Step, (date: Date) => string> = {
  hourly: (date) => format(date, 'yyyy-MM-dd HH:00'),
  daily: (date) => format(date, 'yyyy-MM-dd'),
  weekly(date) {
    const firstWeekDay = format(startOfISOWeek(date), 'yyyy-MM-dd');
    const lastWeekDay = format(endOfISOWeek(date), 'yyyy-MM-dd');

    return `${firstWeekDay} - ${lastWeekDay}`;
  },
  monthly: (date) => format(date, 'yyyy-MM'),
};

const determineInitialStep = (oldestVisitDate: string): Step => {
  const now = new Date();
  const oldestDate = parseISO(oldestVisitDate);
  const matcher = cond<never, Step | undefined>([
    [ () => differenceInDays(now, oldestDate) <= 2, always<Step>('hourly') ], // Less than 2 days
    [ () => differenceInMonths(now, oldestDate) <= 1, always<Step>('daily') ], // Between 2 days and 1 month
    [ () => differenceInMonths(now, oldestDate) <= 6, always<Step>('weekly') ], // Between 1 and 6 months
  ]);

  return matcher() ?? 'monthly';
};

const groupVisitsByStep = (step: Step, visits: NormalizedVisit[]): Stats => countBy(
  (visit) => STEP_TO_DATE_FORMAT[step](parseISO(visit.date)),
  visits,
);

const visitsToDatasetGroups = (step: Step, visits: NormalizedVisit[]) =>
  visits.reduce<Record<string, NormalizedVisit[]>>(
    (acc, visit) => {
      const key = STEP_TO_DATE_FORMAT[step](parseISO(visit.date));

      acc[key] = acc[key] ?? [];
      acc[key].push(visit);

      return acc;
    },
    {},
  );

const generateLabels = (step: Step, visits: NormalizedVisit[]): string[] => {
  const diffFunc = STEP_TO_DIFF_FUNC_MAP[step];
  const formatter = STEP_TO_DATE_FORMAT[step];
  const newerDate = parseISO(visits[0].date);
  const oldestDate = parseISO(visits[visits.length - 1].date);
  const size = diffFunc(newerDate, oldestDate);
  const duration = STEP_TO_DURATION_MAP[step];

  return [
    formatter(oldestDate),
    ...rangeOf(size, () => formatter(add(oldestDate, duration))),
  ];
};

const generateLabelsAndGroupedVisits = (
  visits: NormalizedVisit[],
  groupedVisitsWithGaps: Stats,
  step: Step,
  skipNoElements: boolean,
): [string[], number[]] => {
  if (skipNoElements) {
    return [ Object.keys(groupedVisitsWithGaps), Object.values(groupedVisitsWithGaps) ];
  }

  const labels = generateLabels(step, visits);

  return [ labels, fillTheGaps(groupedVisitsWithGaps, labels) ];
};

const generateDataset = (data: number[], label: string, color: string): ChartDataSets => ({
  label,
  data,
  fill: false,
  lineTension: 0.2,
  borderColor: color,
  backgroundColor: color,
});

let selectedLabel: string | null = null;

const chartElementAtEvent = (
  datasetsByPoint: Record<string, NormalizedVisit[]>,
  setSelectedVisits?: (visits: NormalizedVisit[]) => void,
) => ([ chart ]: [{ _index: number; _chart: Chart }]) => {
  if (!setSelectedVisits || !chart) {
    return;
  }

  const { _index: index, _chart: { data } } = chart;
  const { labels } = data as { labels: string[] };

  if (selectedLabel === labels[index]) {
    setSelectedVisits([]);
    selectedLabel = null;
  } else {
    setSelectedVisits(labels[index] && datasetsByPoint[labels[index]] || []);
    selectedLabel = labels[index] ?? null;
  }
};

const LineChartCard = (
  { title, visits, highlightedVisits, highlightedLabel = 'Selected', setSelectedVisits }: LineChartCardProps,
) => {
  const [ step, setStep ] = useState<Step>(
    visits.length > 0 ? determineInitialStep(visits[visits.length - 1].date) : 'monthly',
  );
  const [ skipNoVisits, toggleSkipNoVisits ] = useToggle(true);

  const datasetsByPoint = useMemo(() => visitsToDatasetGroups(step, visits), [ step, visits ]);
  const groupedVisitsWithGaps = useMemo(() => groupVisitsByStep(step, reverse(visits)), [ step, visits ]);
  const [ labels, groupedVisits ] = useMemo(
    () => generateLabelsAndGroupedVisits(visits, groupedVisitsWithGaps, step, skipNoVisits),
    [ visits, step, skipNoVisits ],
  );
  const groupedHighlighted = useMemo(
    () => fillTheGaps(groupVisitsByStep(step, reverse(highlightedVisits)), labels),
    [ highlightedVisits, step, labels ],
  );

  const data: ChartData = {
    labels,
    datasets: [
      generateDataset(groupedVisits, 'Visits', MAIN_COLOR),
      highlightedVisits.length > 0 && generateDataset(groupedHighlighted, highlightedLabel, HIGHLIGHTED_COLOR),
    ].filter(Boolean) as ChartDataSets[],
  };
  const options: ChartOptions = {
    maintainAspectRatio: false,
    legend: { display: false },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            precision: 0,
            callback: prettify,
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: { display: true, labelString: STEPS_MAP[step] },
        },
      ],
    },
    tooltips: {
      intersect: false,
      axis: 'x',
      callbacks: {
        label: renderNonDoughnutChartLabel('yLabel'),
      },
    },
    onHover: (pointerOnHover) as any, // TODO Types seem to be incorrectly defined in @types/chart.js
  };

  return (
    <Card>
      <CardHeader>
        {title}
        <div className="float-right">
          <UncontrolledDropdown>
            <DropdownToggle caret color="link" className="btn-sm p-0">
              Group by
            </DropdownToggle>
            <DropdownMenu right>
              {Object.entries(STEPS_MAP).map(([ value, menuText ]) => (
                <DropdownItem key={value} active={step === value} onClick={() => setStep(value as Step)}>
                  {menuText}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <div className="float-right mr-2">
          <ToggleSwitch checked={skipNoVisits} onChange={toggleSkipNoVisits}>
            <small>Skip dates with no visits</small>
          </ToggleSwitch>
        </div>
      </CardHeader>
      <CardBody className="line-chart-card__body">
        <Line
          data={data}
          options={options}
          getElementAtEvent={chartElementAtEvent(datasetsByPoint, setSelectedVisits)}
        />
      </CardBody>
    </Card>
  );
};

export default LineChartCard;
