import { shallow } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Chart, ChartDataset } from 'chart.js';
import { DoughnutChartLegend } from '../../../src/visits/charts/DoughnutChartLegend';

describe('<DoughnutChartLegend />', () => {
  const labels = ['foo', 'bar', 'baz', 'foo2', 'bar2'];
  const colors = ['foo_color', 'bar_color', 'baz_color'];
  const defaultColor = 'red';
  const datasets = [Mock.of<ChartDataset>({ backgroundColor: colors })];
  const chart = Mock.of<Chart>({
    config: {
      data: { labels, datasets },
      options: { defaultColor } as any,
    },
  });

  it('renders the expected amount of items with expected colors and labels', () => {
    const wrapper = shallow(<DoughnutChartLegend chart={chart} />);
    const items = wrapper.find('li');

    expect.assertions(labels.length * 2 + 1);
    expect(items).toHaveLength(labels.length);
    labels.forEach((label, index) => {
      const item = items.at(index);

      expect(item.find('.doughnut-chart-legend__item-color').prop('style')).toEqual({
        backgroundColor: colors[index] ?? defaultColor,
      });
      expect(item.find('.doughnut-chart-legend__item-text').text()).toEqual(label);
    });
  });
});
