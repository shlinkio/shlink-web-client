import { Card, CardHeader, CardBody } from 'reactstrap';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import React from 'react';
import { keys, values } from 'ramda';

const propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  isBarChart: PropTypes.bool,
  stats: PropTypes.object,
  matchMedia: PropTypes.func,
};
const defaultProps = {
  matchMedia: global.window ? global.window.matchMedia : () => {},
};

const generateGraphData = (title, isBarChart, labels, data) => ({
  labels,
  datasets: [
    {
      title,
      data,
      backgroundColor: isBarChart ? 'rgba(70, 150, 229, 0.4)' : [
        '#97BBCD',
        '#DCDCDC',
        '#F7464A',
        '#46BFBD',
        '#FDB45C',
        '#949FB1',
        '#4D5360',
      ],
      borderColor: isBarChart ? 'rgba(70, 150, 229, 1)' : 'white',
      borderWidth: 2,
    },
  ],
});

const determineGraphAspectRatio = (barsCount, isBarChart, matchMedia) => {
  const determineAspectRationModifier = () => {
    switch (true) {
      case matchMedia('(max-width: 1200px)').matches:
        return 1.5; // eslint-disable-line no-magic-numbers
      case matchMedia('(max-width: 992px)').matches:
        return 1.75; // eslint-disable-line no-magic-numbers
      case matchMedia('(max-width: 768px)').matches:
        return 2; // eslint-disable-line no-magic-numbers
      case matchMedia('(max-width: 576px)').matches:
        return 2.25; // eslint-disable-line no-magic-numbers
      default:
        return 1;
    }
  };

  const MAX_BARS_WITHOUT_HEIGHT = 20;
  const DEFAULT_ASPECT_RATION = 2;
  const shouldCalculateAspectRatio = isBarChart && barsCount > MAX_BARS_WITHOUT_HEIGHT;

  return shouldCalculateAspectRatio
    ? MAX_BARS_WITHOUT_HEIGHT / determineAspectRationModifier() * DEFAULT_ASPECT_RATION / barsCount
    : DEFAULT_ASPECT_RATION;
};

const renderGraph = (title, isBarChart, stats, matchMedia) => {
  const Component = isBarChart ? HorizontalBar : Doughnut;
  const labels = keys(stats);
  const data = values(stats);
  const aspectRatio = determineGraphAspectRatio(labels.length, isBarChart, matchMedia);
  const options = {
    aspectRatio,
    legend: isBarChart ? { display: false } : { position: 'right' },
    scales: isBarChart ? {
      xAxes: [
        {
          ticks: { beginAtZero: true },
        },
      ],
    } : null,
  };

  return <Component data={generateGraphData(title, isBarChart, labels, data)} options={options} height={null} />;
};

const GraphCard = ({ title, children, isBarChart, stats, matchMedia }) => (
  <Card className="mt-4">
    <CardHeader className="graph-card__header">{children || title}</CardHeader>
    <CardBody>{renderGraph(title, isBarChart, stats, matchMedia)}</CardBody>
  </Card>
);

GraphCard.propTypes = propTypes;
GraphCard.defaultProps = defaultProps;

export default GraphCard;
