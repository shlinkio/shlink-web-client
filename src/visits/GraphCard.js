import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import React from 'react';
import { keys, values, zipObj } from 'ramda';
import './GraphCard.scss';

const propTypes = {
  title: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),
  footer: PropTypes.oneOfType([ PropTypes.string, PropTypes.node ]),
  isBarChart: PropTypes.bool,
  stats: PropTypes.object,
  max: PropTypes.number,
  highlightedStats: PropTypes.object,
};

const generateGraphData = (title, isBarChart, labels, data, highlightedData) => ({
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
    highlightedData && {
      title,
      label: 'Selected',
      data: highlightedData,
      backgroundColor: 'rgba(247, 127, 40, 0.4)',
      borderColor: '#F77F28',
      borderWidth: 2,
    },
  ].filter(Boolean),
});

const dropLabelIfHidden = (label) => label.startsWith('hidden') ? '' : label;

const renderGraph = (title, isBarChart, stats, max, highlightedStats) => {
  const Component = isBarChart ? HorizontalBar : Doughnut;
  const labels = keys(stats).map(dropLabelIfHidden);
  const data = values(!highlightedStats ? stats : keys(highlightedStats).reduce((acc, highlightedKey) => {
    if (acc[highlightedKey]) {
      acc[highlightedKey] -= highlightedStats[highlightedKey];
    }

    return acc;
  }, stats));
  const highlightedData = highlightedStats && values({ ...zipObj(labels, labels.map(() => 0)), ...highlightedStats });

  const options = {
    legend: isBarChart ? { display: false } : { position: 'right' },
    scales: isBarChart && {
      xAxes: [
        {
          ticks: { beginAtZero: true, max },
          stacked: true,
        },
      ],
      yAxes: [{ stacked: true }],
    },
    tooltips: {
      intersect: !isBarChart,

      // Do not show tooltip on items with empty label when in a bar chart
      filter: ({ yLabel }) => !isBarChart || yLabel !== '',
    },
  };
  const graphData = generateGraphData(title, isBarChart, labels, data, highlightedData);
  const height = isBarChart && labels.length > 20 ? labels.length * 8 : null;

  // Provide a key based on the height, so that every time the dataset changes, a new graph is rendered
  return <Component key={height} data={graphData} options={options} height={height} />;
};

const GraphCard = ({ title, footer, isBarChart, stats, max, highlightedStats }) => (
  <Card className="mt-4">
    <CardHeader className="graph-card__header">{typeof title === 'function' ? title() : title}</CardHeader>
    <CardBody>{renderGraph(title, isBarChart, stats, max, highlightedStats)}</CardBody>
    {footer && <CardFooter className="graph-card__footer--sticky">{footer}</CardFooter>}
  </Card>
);

GraphCard.propTypes = propTypes;

export default GraphCard;
