import type { FC } from 'react';
import type { Chart } from 'chart.js';
import './DoughnutChartLegend.scss';

interface DoughnutChartLegendProps {
  chart: Chart;
}

export const DoughnutChartLegend: FC<DoughnutChartLegendProps> = ({ chart }) => {
  const { config } = chart;
  const { labels = [], datasets = [] } = config.data ?? {};
  const [{ backgroundColor: colors }] = datasets;
  const { defaultColor } = config.options ?? {} as any;

  return (
    <ul className="doughnut-chart-legend">
      {(labels as string[]).map((label, index) => (
        <li key={label} className="doughnut-chart-legend__item d-flex">
          <div
            className="doughnut-chart-legend__item-color"
            style={{ backgroundColor: (colors as string[])[index] ?? defaultColor }}
          />
          <small className="doughnut-chart-legend__item-text flex-fill">{label}</small>
        </li>
      ))}
    </ul>
  );
};
