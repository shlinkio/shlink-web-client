import { FC, useState, memo } from 'react';
import { Chart, ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { keys, values } from 'ramda';
import { Doughnut } from 'react-chartjs-2';
import { renderPieChartLabel } from '../../utils/helpers/charts';
import { isDarkThemeEnabled, PRIMARY_DARK_COLOR, PRIMARY_LIGHT_COLOR } from '../../utils/theme';
import { Stats } from '../types';
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
  const [chartRef, setChartRef] = useState<Chart | undefined>(); // Cannot use useRef here
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
            setChartRef(element ?? undefined);
          }}
        />
      </div>
      <div className="col-sm-12 col-md-5">
        {chartRef && <DoughnutChartLegend chart={chartRef} />}
      </div>
    </div>
  );
});
