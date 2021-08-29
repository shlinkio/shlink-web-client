import { FC } from 'react';
import { Chart } from 'chart.js';
import './PieChartLegend.scss';

export const PieChartLegend: FC<{ chart: Chart }> = ({ chart }) => {
  const { config } = chart;
  const { labels = [], datasets = [] } = config.data ?? {};
  const { defaultColor } = config.options ?? {} as any;
  const [{ backgroundColor: colors }] = datasets;

  return (
    <ul className="default-chart__pie-chart-legend">
      {(labels as string[]).map((label, index) => (
        <li key={label} className="default-chart__pie-chart-legend-item d-flex">
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
