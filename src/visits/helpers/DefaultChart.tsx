import { useRef } from 'react';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import { keys, values } from 'ramda';
import classNames from 'classnames';
import Chart, { ChartData, ChartDataSets, ChartOptions } from 'chart.js';
import { fillTheGaps } from '../../utils/helpers/visits';
import { Stats } from '../types';
import { prettify } from '../../utils/helpers/numbers';
import { pointerOnHover, renderDoughnutChartLabel, renderNonDoughnutChartLabel } from '../../utils/helpers/charts';
import './DefaultChart.scss';

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
      label: highlightedLabel ?? 'Selected',
      data: highlightedData,
      backgroundColor: 'rgba(247, 127, 40, 0.4)',
      borderColor: '#F77F28',
      borderWidth: 2,
    },
  ].filter(Boolean) as ChartDataSets[],
});

const dropLabelIfHidden = (label: string) => label.startsWith('hidden') ? '' : label;

const determineHeight = (isBarChart: boolean, labels: string[]): number | undefined => {
  if (!isBarChart) {
    return 300;
  }

  return isBarChart && labels.length > 20 ? labels.length * 8 : undefined;
};

const renderPieChartLegend = ({ config }: Chart) => {
  const { labels = [], datasets = [] } = config.data ?? {};
  const { defaultColor } = config.options ?? {} as any;
  const [{ backgroundColor: colors }] = datasets;

  return (
    <ul className="default-chart__pie-chart-legend">
      {labels.map((label, index) => (
        <li key={label as string} className="default-chart__pie-chart-legend-item d-flex">
          <div
            className="default-chart__pie-chart-legend-item-color"
            style={{ backgroundColor: (colors as string[])[index] || defaultColor }}
          />
          <small className="default-chart__pie-chart-legend-item-text flex-fill">{label}</small>
        </li>
      ))}
    </ul>
  );
};

const chartElementAtEvent = (onClick?: (label: string) => void) => ([ chart ]: [{ _index: number; _chart: Chart }]) => {
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
  const Component = isBarChart ? HorizontalBar : Doughnut;
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
  const chartRef = useRef<HorizontalBar | Doughnut>();

  const options: ChartOptions = {
    legend: { display: false },
    legendCallback: !isBarChart && renderPieChartLegend as any,
    scales: !isBarChart ? undefined : {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            // @ts-expect-error
            precision: 0,
            callback: prettify,
            max,
          },
          stacked: true,
        },
      ],
      yAxes: [{ stacked: true }],
    },
    tooltips: {
      intersect: !isBarChart,
      // Do not show tooltip on items with empty label when in a bar chart
      filter: ({ yLabel }) => !isBarChart || yLabel !== '',
      callbacks: {
        label: isBarChart ? renderNonDoughnutChartLabel('xLabel') : renderDoughnutChartLabel,
      },
    },
    onHover: !isBarChart ? undefined : (pointerOnHover) as any, // TODO Types seem to be incorrectly defined in @types/chart.js
  };
  const graphData = generateGraphData(title, isBarChart, labels, data, highlightedData, highlightedLabel);
  const height = determineHeight(isBarChart, labels);

  // Provide a key based on the height, so that every time the dataset changes, a new graph is rendered
  return (
    <div className="row">
      <div className={classNames('col-sm-12', { 'col-md-7': !isBarChart })}>
        <Component
          ref={chartRef as any}
          key={height}
          data={graphData}
          options={options}
          height={height}
          getElementAtEvent={chartElementAtEvent(onClick)}
        />
      </div>
      {!isBarChart && (
        <div className="col-sm-12 col-md-5">
          {chartRef.current?.chartInstance.generateLegend()}
        </div>
      )}
    </div>
  );
};

export default DefaultChart;
