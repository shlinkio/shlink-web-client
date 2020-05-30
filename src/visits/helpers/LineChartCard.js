import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import { reverse } from 'ramda';
import moment from 'moment';
import { VisitType } from '../types';
import { fillTheGaps } from '../../utils/helpers/visits';

const propTypes = {
  title: PropTypes.string,
  visits: PropTypes.arrayOf(VisitType),
  highlightedVisits: PropTypes.arrayOf(VisitType),
};

const STEP_TO_DATE_FORMAT_MAP = {
  hourly: 'YYYY-MM-DD HH:00',
  daily: 'YYYY-MM-DD',
  weekly: '',
  monthly: 'YYYY-MM',
};

const groupVisitsByStep = (step, visits) => visits.reduce((acc, visit) => {
  const key = moment(visit.date).format(STEP_TO_DATE_FORMAT_MAP[step]);

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
  const [ step ] = useState('monthly'); // hourly, daily, weekly, monthly
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
      <CardHeader>{title}</CardHeader>
      <CardBody>
        <Line data={data} options={options} height={80} />
      </CardBody>
    </Card>
  );
};

LineChartCard.propTypes = propTypes;

export default LineChartCard;
