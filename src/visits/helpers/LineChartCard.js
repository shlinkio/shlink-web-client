import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
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
import { reverse } from 'ramda';
import moment from 'moment';
import { VisitType } from '../types';
import { fillTheGaps } from '../../utils/helpers/visits';
import './LineChartCard.scss';
import { useToggle } from '../../utils/helpers/hooks';
import { rangeOf } from '../../utils/utils';
import Checkbox from '../../utils/Checkbox';

const propTypes = {
  title: PropTypes.string,
  visits: PropTypes.arrayOf(VisitType),
  highlightedVisits: PropTypes.arrayOf(VisitType),
};

const STEPS_MAP = {
  monthly: 'Month',
  weekly: 'Week',
  daily: 'Day',
  hourly: 'Hour',
};

const STEP_TO_DATE_UNIT_MAP = {
  hourly: 'hour',
  daily: 'day',
  weekly: 'week',
  monthly: 'month',
};

const STEP_TO_DATE_FORMAT = {
  hourly: (date) => moment(date).format('YYYY-MM-DD HH:00'),
  daily: (date) => moment(date).format('YYYY-MM-DD'),
  weekly(date) {
    const firstWeekDay = moment(date).isoWeekday(1).format('YYYY-MM-DD');
    const lastWeekDay = moment(date).isoWeekday(7).format('YYYY-MM-DD');

    return `${firstWeekDay} - ${lastWeekDay}`;
  },
  monthly: (date) => moment(date).format('YYYY-MM'),
};

const groupVisitsByStep = (step, visits) => visits.reduce((acc, visit) => {
  const key = STEP_TO_DATE_FORMAT[step](visit.date);

  acc[key] = acc[key] ? acc[key] + 1 : 1;

  return acc;
}, {});

const generateLabels = (step, visits) => {
  const unit = STEP_TO_DATE_UNIT_MAP[step];
  const formatter = STEP_TO_DATE_FORMAT[step];
  const newerDate = moment(visits[0].date);
  const oldestDate = moment(visits[visits.length - 1].date);
  const size = newerDate.diff(oldestDate, unit);

  return [
    formatter(oldestDate),
    ...rangeOf(size, () => formatter(oldestDate.add(1, unit))),
  ];
};

const generateLabelsAndGroupedVisits = (visits, groupedVisitsWithGaps, step, skipNoElements) => {
  if (skipNoElements) {
    return [ Object.keys(groupedVisitsWithGaps), groupedVisitsWithGaps ];
  }

  const labels = generateLabels(step, visits);

  return [ labels, fillTheGaps(groupedVisitsWithGaps, labels) ];
};

const generateDataset = (stats, label, color) => ({
  label,
  data: Object.values(stats),
  fill: false,
  lineTension: 0.2,
  borderColor: color,
  backgroundColor: color,
});

const LineChartCard = ({ title, visits, highlightedVisits }) => {
  const [ step, setStep ] = useState('monthly');
  const [ skipNoVisits, toggleSkipNoVisits ] = useToggle(true);

  const groupedVisitsWithGaps = useMemo(() => groupVisitsByStep(step, reverse(visits)), [ step, visits ]);
  const [ labels, groupedVisits ] = useMemo(
    () => generateLabelsAndGroupedVisits(visits, groupedVisitsWithGaps, step, skipNoVisits),
    [ visits, step, skipNoVisits ]
  );
  const groupedHighlighted = useMemo(
    () => fillTheGaps(groupVisitsByStep(step, reverse(highlightedVisits)), labels),
    [ highlightedVisits, step, labels ]
  );

  const data = {
    labels,
    datasets: [
      generateDataset(groupedVisits, 'Visits', '#4696e5'),
      highlightedVisits.length > 0 && generateDataset(groupedHighlighted, 'Selected', '#F77F28'),
    ].filter(Boolean),
  };
  const options = {
    maintainAspectRatio: false,
    legend: { display: false },
    scales: {
      yAxes: [
        {
          ticks: { beginAtZero: true, precision: 0 },
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
    },
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
                <DropdownItem key={value} active={step === value} onClick={() => setStep(value)}>
                  {menuText}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <div className="float-right mr-2">
          <Checkbox checked={skipNoVisits} onChange={toggleSkipNoVisits}>
            <small>Skip dates with no visits</small>
          </Checkbox>
        </div>
      </CardHeader>
      <CardBody className="line-chart-card__body">
        <Line data={data} options={options} />
      </CardBody>
    </Card>
  );
};

LineChartCard.propTypes = propTypes;

export default LineChartCard;
