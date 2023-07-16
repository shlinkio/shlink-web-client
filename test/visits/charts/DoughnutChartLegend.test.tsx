import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { Chart, ChartDataset } from 'chart.js';
import { DoughnutChartLegend } from '../../../src/shlink-web-component/visits/charts/DoughnutChartLegend';

describe('<DoughnutChartLegend />', () => {
  const labels = ['foo', 'bar', 'baz', 'foo2', 'bar2'];
  const colors = ['green', 'blue', 'yellow'];
  const defaultColor = 'red';
  const datasets = [fromPartial<ChartDataset>({ backgroundColor: colors })];
  const chart = fromPartial<Chart>({
    config: {
      data: { labels, datasets },
      options: { defaultColor } as any,
    },
  });

  it('renders the expected amount of items with expected colors and labels', () => {
    render(<DoughnutChartLegend chart={chart} />);

    const items = screen.getAllByRole('listitem');

    expect.assertions(labels.length * 2 + 1);
    expect(items).toHaveLength(labels.length);

    labels.forEach((label, index) => {
      const item = items[index];

      expect(item.querySelector('.doughnut-chart-legend__item-color')).toHaveAttribute(
        'style',
        `background-color: ${colors[index] ?? defaultColor};`,
      );
      expect(item.querySelector('.doughnut-chart-legend__item-text')).toHaveTextContent(label);
    });
  });
});
