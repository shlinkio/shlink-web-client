import { FC } from 'react';
import { Chart } from 'chart.js';
import './PieChartLegend.scss';

interface PieChartLegendProps {
  chart: Chart;
}

export const PieChartLegend: FC<PieChartLegendProps> = ({ chart }) => {
  const { config } = chart;
  const { labels = [], datasets = [] } = config.data ?? {};
  const [{ backgroundColor: colors }] = datasets;
  const { defaultColor } = config.options ?? {} as any;

  return (
    <ul className="pie-chart-legend">
      {(labels as string[]).map((label, index) => (
        <li key={label} className="pie-chart-legend__item d-flex">
          <div
            className="pie-chart-legend__item-color"
            style={{ backgroundColor: (colors as string[])[index] ?? defaultColor }}
          />
          <small className="pie-chart-legend__item-text flex-fill">{label}</small>
        </li>
      ))}
    </ul>
  );
};
