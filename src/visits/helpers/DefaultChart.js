import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import { keys, values } from 'ramda';
import classNames from 'classnames';
import { fillTheGaps } from '../../utils/helpers/visits';
import './DefaultChart.scss';

const propTypes = {
  title: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),
  isBarChart: PropTypes.bool,
  stats: PropTypes.object,
  max: PropTypes.number,
  highlightedStats: PropTypes.object,
  highlightedLabel: PropTypes.string,
  onClick: PropTypes.func,
};

const generateGraphData = (title, isBarChart, labels, data, highlightedData, highlightedLabel) => ({
  labels,
  datasets: [
    {
      title,
      label: highlightedData ? 'Non-selected' : 'Visits',
      data,
      backgroundColor: isBarChart ? 'rgba(70, 150, 229, 0.4)' : [
        '#97BBCD',
        '#F7464A',
        '#46BFBD',
        '#FDB45C',
        '#949FB1',
        '#57A773',
        '#414066',
        '#08B2E3',
        '#B6C454',
        '#DCDCDC',
        '#463730',
      ],
      borderColor: isBarChart ? 'rgba(70, 150, 229, 1)' : 'white',
      borderWidth: 2,
    },
    highlightedData && {
      title,
      label: highlightedLabel || 'Selected',
      data: highlightedData,
      backgroundColor: 'rgba(247, 127, 40, 0.4)',
      borderColor: '#F77F28',
      borderWidth: 2,
    },
  ].filter(Boolean),
});

const dropLabelIfHidden = (label) => label.startsWith('hidden') ? '' : label;

const determineHeight = (isBarChart, labels) => {
  if (!isBarChart && labels.length > 8) {
    return 200;
  }

  return isBarChart && labels.length > 20 ? labels.length * 8 : null;
};

/* eslint-disable react/prop-types */
const renderPieChartLegend = ({ config }) => {
  const { labels, datasets } = config.data;
  const { defaultColor } = config.options;
  const [{ backgroundColor: colors }] = datasets;

  return (
    <ul className="default-chart__pie-chart-legend">
      {labels.map((label, index) => (
        <li key={label} className="default-chart__pie-chart-legend-item d-flex">
          <div
            className="default-chart__pie-chart-legend-item-color"
            style={{ backgroundColor: colors[index] || defaultColor }}
          />
          <small className="default-chart__pie-chart-legend-item-text flex-fill">{label}</small>
        </li>
      ))}
    </ul>
  );
};
/* eslint-enable react/prop-types */

const chartElementAtEvent = (onClick) => ([ chart ]) => {
  if (!onClick || !chart) {
    return;
  }

  const { _index, _chart: { data } } = chart;
  const { labels } = data;

  onClick(labels[_index]);
};

const DefaultChart = ({ title, isBarChart, stats, max, highlightedStats, highlightedLabel, onClick }) => {
  const hasHighlightedStats = highlightedStats && Object.keys(highlightedStats).length > 0;
  const Component = isBarChart ? HorizontalBar : Doughnut;
  const labels = keys(stats).map(dropLabelIfHidden);
  const data = values(!hasHighlightedStats ? stats : keys(highlightedStats).reduce((acc, highlightedKey) => {
    if (acc[highlightedKey]) {
      acc[highlightedKey] -= highlightedStats[highlightedKey];
    }

    return acc;
  }, { ...stats }));
  const highlightedData = hasHighlightedStats && fillTheGaps(highlightedStats, labels);
  const chartRef = useRef();

  const options = {
    legend: { display: false },
    legendCallback: !isBarChart && renderPieChartLegend,
    scales: isBarChart && {
      xAxes: [
        {
          ticks: { beginAtZero: true, precision: 0, max },
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
    onHover: isBarChart && (({ target }, chartElement) => {
      target.style.cursor = chartElement[0] ? 'pointer' : 'default';
    }),
  };
  const graphData = generateGraphData(title, isBarChart, labels, data, highlightedData, highlightedLabel);
  const height = determineHeight(isBarChart, labels);

  // Provide a key based on the height, so that every time the dataset changes, a new graph is rendered
  return (
    <div className="row">
      <div className={classNames('col-sm-12', { 'col-md-7': !isBarChart })}>
        <Component
          ref={chartRef}
          key={height}
          data={graphData}
          options={options}
          height={height}
          getElementAtEvent={chartElementAtEvent(onClick)}
        />
      </div>
      {!isBarChart && (
        <div className="col-sm-12 col-md-5">
          {chartRef.current && chartRef.current.chartInstance.generateLegend()}
        </div>
      )}
    </div>
  );
};

DefaultChart.propTypes = propTypes;

export default DefaultChart;
