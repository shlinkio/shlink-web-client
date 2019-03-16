import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import React from 'react';
import { keys, values } from 'ramda';
import './GraphCard.scss';

const propTypes = {
  title: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),
  footer: PropTypes.oneOfType([ PropTypes.string, PropTypes.node ]),
  isBarChart: PropTypes.bool,
  stats: PropTypes.object,
  max: PropTypes.number,
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

const dropLabelIfHidden = (label) => label.startsWith('hidden') ? '' : label;

const renderGraph = (title, isBarChart, stats, max) => {
  const Component = isBarChart ? HorizontalBar : Doughnut;
  const labels = keys(stats).map(dropLabelIfHidden);
  const data = values(stats);
  const options = {
    legend: isBarChart ? { display: false } : { position: 'right' },
    scales: isBarChart && {
      xAxes: [
        {
          ticks: { beginAtZero: true, max },
        },
      ],
    },
    tooltips: {
      intersect: !isBarChart,

      // Do not show tooltip on items with empty label when in a bar chart
      filter: ({ yLabel }) => !isBarChart || yLabel !== '',
    },
  };
  const graphData = generateGraphData(title, isBarChart, labels, data);
  const height = isBarChart && labels.length > 20 ? labels.length * 8 : null;

  // Provide a key based on the height, so that every time the dataset changes, a new graph is rendered
  return <Component key={height} data={graphData} options={options} height={height} />;
};

const GraphCard = ({ title, footer, isBarChart, stats, max }) => (
  <Card className="mt-4">
    <CardHeader className="graph-card__header">{typeof title === 'function' ? title() : title}</CardHeader>
    <CardBody>{renderGraph(title, isBarChart, stats, max)}</CardBody>
    {footer && <CardFooter className="graph-card__footer--sticky">{footer}</CardFooter>}
  </Card>
);

GraphCard.propTypes = propTypes;

export default GraphCard;
