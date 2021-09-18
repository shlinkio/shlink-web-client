import { useState, memo } from 'react';
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
  stats: Stats;
  isBarChart?: boolean;
  max?: number;
  highlightedStats?: Stats;
  highlightedLabel?: string;
  onClick?: (label: string) => void;
}

const generateChartDatasets = (
  isBarChart: boolean,
  data: number[],
  highlightedData: number[],
  highlightedLabel?: string,
): ChartDataset[] => {
  const mainDataset: ChartDataset = {
    label: highlightedLabel ? 'Non-selected' : 'Visits',
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
  };

  if (!isBarChart || highlightedData.every((value) => value === 0)) {
    return [ mainDataset ];
  }

  const highlightedDataset: ChartDataset = {
    label: highlightedLabel ?? 'Selected',
    data: highlightedData,
    backgroundColor: HIGHLIGHTED_COLOR_ALPHA,
    borderColor: HIGHLIGHTED_COLOR,
    borderWidth: 2,
  };

  return [ mainDataset, highlightedDataset ];
};

const generateChartData = (
  isBarChart: boolean,
  labels: string[],
  data: number[],
  highlightedData: number[],
  highlightedLabel?: string,
): ChartData => ({
  labels,
  datasets: generateChartDatasets(isBarChart, data, highlightedData, highlightedLabel),
});

const dropLabelIfHidden = (label: string) => label.startsWith('hidden') ? '' : label;

const determineHeight = (isBarChart: boolean, labels: string[]): number | undefined => {
  if (!isBarChart) {
    return 300;
  }

  return isBarChart && labels.length > 20 ? labels.length * 8 : undefined;
};

const chartElementAtEvent = (
  labels: string[],
  onClick?: (label: string) => void,
) => ([ chart ]: [{ index: number }]) => {
  if (!onClick || !chart) {
    return;
  }

  onClick(labels[chart.index]);
};

const statsAreDefined = (stats: Stats | undefined): stats is Stats => !!stats && Object.keys(stats).length > 0;

const DefaultChart = memo((
  { isBarChart = false, stats, max, highlightedStats, highlightedLabel, onClick }: DefaultChartProps,
) => {
  const Component = isBarChart ? Bar : Doughnut;
  const [ chartRef, setChartRef ] = useState<Chart | undefined>(); // Cannot use useRef here
  const labels = keys(stats).map(dropLabelIfHidden);
  const data = values(
    !statsAreDefined(highlightedStats) ? stats : keys(highlightedStats).reduce((acc, highlightedKey) => {
      if (acc[highlightedKey]) {
        acc[highlightedKey] -= highlightedStats[highlightedKey];
      }

      return acc;
    }, { ...stats }),
  );
  const highlightedData = fillTheGaps(highlightedStats ?? {}, labels);

  const options: ChartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        intersect: !isBarChart,
        mode: isBarChart ? 'y' : 'index',
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
  const chartData = generateChartData(isBarChart, labels, data, highlightedData, highlightedLabel);
  const height = determineHeight(isBarChart, labels);

  // Provide a key based on the height, to force re-render every time the dataset changes (example, due to pagination)
  const renderChartComponent = (customKey: string) => (
    <Component
      ref={(element) => {
        setChartRef(element ?? undefined);
      }}
      key={`${height}_${customKey}`}
      data={chartData}
      options={options}
      height={height}
      getElementAtEvent={chartElementAtEvent(labels, onClick) as any}
    />
  );

  return (
    <div className="row">
      <div className={classNames('col-sm-12', { 'col-md-7': !isBarChart })}>
        {/* It's VERY IMPORTANT to render two different components here, as one has 1 dataset and the other has 2 */}
        {/* Using the same component causes a crash when switching from 1 to 2 datasets, and then back to 1 dataset */}
        {highlightedStats !== undefined && renderChartComponent('with_stats')}
        {highlightedStats === undefined && renderChartComponent('without_stats')}
      </div>
      {!isBarChart && (
        <div className="col-sm-12 col-md-5">
          {chartRef && <PieChartLegend chart={chartRef} />}
        </div>
      )}
    </div>
  );
});

export default DefaultChart;
