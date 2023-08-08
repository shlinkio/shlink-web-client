import { isDarkThemeEnabled, PRIMARY_DARK_COLOR, PRIMARY_LIGHT_COLOR } from '@shlinkio/shlink-frontend-kit';
import type { Chart, ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { keys, values } from 'ramda';
import type { FC } from 'react';
import { memo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { renderPieChartLabel } from '../../utils/helpers/charts';
import type { Stats } from '../types';
import { DoughnutChartLegend } from './DoughnutChartLegend';

interface DoughnutChartProps {
  stats: Stats;
}

const generateChartDatasets = (data: number[]): ChartDataset[] => [
  {
    data,
    backgroundColor: [
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
    borderColor: isDarkThemeEnabled() ? PRIMARY_DARK_COLOR : PRIMARY_LIGHT_COLOR,
    borderWidth: 2,
  },
];
const generateChartData = (labels: string[], data: number[]): ChartData => ({
  labels,
  datasets: generateChartDatasets(data),
});

export const DoughnutChart: FC<DoughnutChartProps> = memo(({ stats }) => {
  // Cannot use useRef here, as we need to re-render as soon as the ref is set
  const [chartRef, setChartRef] = useState<Chart>();
  const labels = keys(stats);
  const data = values(stats);

  const options: ChartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        intersect: true,
        callbacks: { label: renderPieChartLabel },
      },
    },
  };
  const chartData = generateChartData(labels, data);

  return (
    <div className="row">
      <div className="col-sm-12 col-md-7">
        <Doughnut
          height={300}
          data={chartData as any}
          options={options as any}
          ref={(element) => {
            if (element) {
              setChartRef(element as Chart);
            }
          }}
        />
      </div>
      <div className="col-sm-12 col-md-5">
        {chartRef && <DoughnutChartLegend chart={chartRef} />}
      </div>
    </div>
  );
});
