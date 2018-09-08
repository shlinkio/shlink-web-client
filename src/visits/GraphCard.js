import { Card, CardHeader, CardBody } from 'reactstrap';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import React from 'react';
import { keys, values } from 'ramda';

const propTypes = {
  title: PropTypes.string,
  isBarChart: PropTypes.bool,
  stats: PropTypes.object,
};

export function GraphCard({ title, isBarChart, stats }) {
  const generateGraphData = (stats) => ({
    labels: keys(stats),
    datasets: [
      {
        title,
        data: values(stats),
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
  const renderGraph = () => {
    const Component = isBarChart ? HorizontalBar : Doughnut;
    const legend = isBarChart ? { display: false } : { position: 'right' };

    return <Component data={generateGraphData(stats)} options={{ legend }} />;
  };

  return (
    <Card className="mt-4">
      <CardHeader>{title}</CardHeader>
      <CardBody>{renderGraph()}</CardBody>
    </Card>
  );
}

GraphCard.propTypes = propTypes;
