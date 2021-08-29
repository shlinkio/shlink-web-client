import { useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { keys, values } from 'ramda';
import classNames from 'classnames';
import { Chart, ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { fillTheGaps } from '../../utils/helpers/visits';
import { Stats } from '../types';
import { prettify } from '../../utils/helpers/numbers';
import { pointerOnHover, renderChartLabel, renderPieChartLabel } from '../../utils/helpers/charts';
import {
  HIGHLIGHTED_COLOR,
  HIGHLIGHTED_COLOR_ALPHA,
  isDarkThemeEnabled,
  MAIN_COLOR,
  MAIN_COLOR_ALPHA,
  PRIMARY_DARK_COLOR,
  PRIMARY_LIGHT_COLOR,
} from '../../utils/theme';
import { PieChartLegend } from './PieChartLegend';

export interface DefaultChartProps {
  title: Function | string;
  stats: Stats;
  isBarChart?: boolean;
  max?: number;
  highlightedStats?: Stats;
  highlightedLabel?: string;
  onClick?: (label: string) => void;
}

const generateGraphData = (
  title: Function | string,
  isBarChart: boolean,
  labels: string[],
  data: number[],
  highlightedData?: number[],
  highlightedLabel?: string,
): ChartData => ({
  labels,
  datasets: [
    {
      title,
      label: highlightedData ? 'Non-selected' : 'Visits',
      data,
      backgroundColor: isBarChart ? MAIN_COLOR_ALPHA : [
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
      borderColor: isBarChart ? MAIN_COLOR : isDarkThemeEnabled() ? PRIMARY_DARK_COLOR : PRIMARY_LIGHT_COLOR,
      borderWidth: 2,
    },
    highlightedData && {
      title,
      label: highlightedLabel ?? 'Selected',
      data: highlightedData,
      backgroundColor: HIGHLIGHTED_COLOR_ALPHA,
      borderColor: HIGHLIGHTED_COLOR,
      borderWidth: 2,
    },
  ].filter(Boolean) as ChartDataset[],
});

const dropLabelIfHidden = (label: string) => label.startsWith('hidden') ? '' : label;

const determineHeight = (isBarChart: boolean, labels: string[]): number | undefined => {
  if (!isBarChart) {
    return 300;
  }

  return isBarChart && labels.length > 20 ? labels.length * 8 : undefined;
};

const chartElementAtEvent = (onClick?: (label: string) => void) => ([ chart ]: [{ _index: number; _chart: Chart }]) => {
  // TODO Check this function actually works with Chart.js 3
  if (!onClick || !chart) {
    return;
  }

  const { _index, _chart: { data } } = chart;
  const { labels } = data;

  onClick(labels?.[_index] as string);
};

const statsAreDefined = (stats: Stats | undefined): stats is Stats => !!stats && Object.keys(stats).length > 0;

const DefaultChart = (
  { title, isBarChart = false, stats, max, highlightedStats, highlightedLabel, onClick }: DefaultChartProps,
) => {
  const Component = isBarChart ? Bar : Doughnut;
  const [ chartRef, setChartRef ] = useState<Chart | undefined>();
  const labels = keys(stats).map(dropLabelIfHidden);
  const data = values(
    !statsAreDefined(highlightedStats) ? stats : keys(highlightedStats).reduce((acc, highlightedKey) => {
      if (acc[highlightedKey]) {
        acc[highlightedKey] -= highlightedStats[highlightedKey];
      }

      return acc;
    }, { ...stats }),
  );
  const highlightedData = statsAreDefined(highlightedStats) ? fillTheGaps(highlightedStats, labels) : undefined;

  const options: ChartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        intersect: !isBarChart,
        // Do not show tooltip on items with empty label when in a bar chart
        filter: ({ label }) => !isBarChart || label !== '',
        callbacks: {
          label: isBarChart ? renderChartLabel : renderPieChartLabel,
        },
      },
    },
    scales: !isBarChart ? undefined : {
      x: {
        beginAtZero: true,
        stacked: true,
        max,
        ticks: {
          precision: 0,
          callback: prettify,
        },
      },
      y: { stacked: true },
    },
    onHover: isBarChart ? pointerOnHover : undefined,
    indexAxis: isBarChart ? 'y' : 'x',
  };
  const graphData = generateGraphData(title, isBarChart, labels, data, highlightedData, highlightedLabel);
  const height = determineHeight(isBarChart, labels);

  // Provide a key based on the height, so that every time the dataset changes, a new graph is rendered
  return (
    <div className="row">
      <div className={classNames('col-sm-12', { 'col-md-7': !isBarChart })}>
        <Component
          ref={(element) => {
            setChartRef(element ?? undefined);
          }}
          key={height}
          data={graphData}
          options={options}
          height={height}
          getElementAtEvent={chartElementAtEvent(onClick) as any} /* TODO */
        />
      </div>
      {!isBarChart && (
        <div className="col-sm-12 col-md-5">
          {chartRef && <PieChartLegend chart={chartRef} />}
        </div>
      )}
    </div>
  );
};

export default DefaultChart;
