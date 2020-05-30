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
import './LineCHartCard.scss';

const propTypes = {
  title: PropTypes.string,
  visits: PropTypes.arrayOf(VisitType),
  highlightedVisits: PropTypes.arrayOf(VisitType),
};

const steps = [
  { value: 'monthly', menuText: 'Month' },
  { value: 'weekly', menuText: 'Week' },
  { value: 'daily', menuText: 'Day' },
  { value: 'hourly', menuText: 'Hour' },
];

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

const generateDataset = (stats, label, color) => ({
  label,
  data: Object.values(stats),
  fill: false,
  lineTension: 0.2,
  borderColor: color,
  backgroundColor: color,
});

const LineChartCard = ({ title, visits, highlightedVisits }) => {
  const [ step, setStep ] = useState(steps[0].value);
  const groupedVisits = useMemo(() => groupVisitsByStep(step, reverse(visits)), [ visits, step ]);
  const labels = useMemo(() => Object.keys(groupedVisits), [ groupedVisits ]);
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
              {steps.map(({ menuText, value }) => (
                <DropdownItem key={value} active={step === value} onClick={() => setStep(value)}>
                  {menuText}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
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
