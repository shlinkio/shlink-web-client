import { FC } from 'react';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { keys, values } from 'ramda';
import { Bar } from 'react-chartjs-2';
import { fillTheGaps } from '../../utils/helpers/visits';
import { pointerOnHover, renderChartLabel } from '../../utils/helpers/charts';
import { prettify } from '../../utils/helpers/numbers';
import { Stats } from '../types';
import { HIGHLIGHTED_COLOR, HIGHLIGHTED_COLOR_ALPHA, MAIN_COLOR, MAIN_COLOR_ALPHA } from '../../utils/theme';

export interface HorizontalBarChartProps {
  stats: Stats;
  max?: number;
  highlightedStats?: Stats;
  highlightedLabel?: string;
  onClick?: (label: string) => void;
}

const dropLabelIfHidden = (label: string) => (label.startsWith('hidden') ? '' : label);
const statsAreDefined = (stats: Stats | undefined): stats is Stats => !!stats && Object.keys(stats).length > 0;
const determineHeight = (labels: string[]): number | undefined => (labels.length > 20 ? labels.length * 10 : undefined);

const generateChartDatasets = (
  data: number[],
  highlightedData: number[],
  highlightedLabel?: string,
): ChartDataset[] => {
  const mainDataset: ChartDataset = {
    data,
    label: highlightedLabel ? 'Non-selected' : 'Visits',
    backgroundColor: MAIN_COLOR_ALPHA,
    borderColor: MAIN_COLOR,
    borderWidth: 2,
  };

  if (highlightedData.every((value) => value === 0)) {
    return [mainDataset];
  }

  const highlightedDataset: ChartDataset = {
    label: highlightedLabel ?? 'Selected',
    data: highlightedData,
    backgroundColor: HIGHLIGHTED_COLOR_ALPHA,
    borderColor: HIGHLIGHTED_COLOR,
    borderWidth: 2,
  };

  return [mainDataset, highlightedDataset];
};
const generateChartData = (
  labels: string[],
  data: number[],
  highlightedData: number[],
  highlightedLabel?: string,
): ChartData => ({
  labels,
  datasets: generateChartDatasets(data, highlightedData, highlightedLabel),
});

type ClickedCharts = [{ index: number }] | [];
const chartElementAtEvent = (labels: string[], onClick?: (label: string) => void) => ([chart]: ClickedCharts) => {
  if (!onClick || !chart) {
    return;
  }

  onClick(labels[chart.index]);
};

export const HorizontalBarChart: FC<HorizontalBarChartProps> = (
  { stats, highlightedStats, highlightedLabel, onClick, max },
) => {
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
        mode: 'y',
        // Do not show tooltip on items with empty label when in a bar chart
        filter: ({ label }) => label !== '',
        callbacks: { label: renderChartLabel },
      },
    },
    scales: {
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
    onHover: pointerOnHover,
    indexAxis: 'y',
  };
  const chartData = generateChartData(labels, data, highlightedData, highlightedLabel);
  const height = determineHeight(labels);

  // Provide a key based on the height, to force re-render every time the dataset changes (example, due to pagination)
  const renderChartComponent = (customKey: string) => (
    <Bar
      key={`${height}_${customKey}`}
      data={chartData as any}
      options={options as any}
      height={height}
      getElementAtEvent={chartElementAtEvent(labels, onClick) as any}
    />
  );

  return (
    <>
      {/* It's VERY IMPORTANT to render two different components here, as one has 1 dataset and the other has 2 */}
      {/* Using the same component causes a crash when switching from 1 to 2 datasets, and then back to 1 dataset */}
      {highlightedStats !== undefined && renderChartComponent('with_stats')}
      {highlightedStats === undefined && renderChartComponent('without_stats')}
    </>
  );
};
