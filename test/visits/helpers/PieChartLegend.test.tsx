import { shallow } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Chart, ChartDataset } from 'chart.js';
import { PieChartLegend } from '../../../src/visits/helpers/PieChartLegend';

describe('<PieChartLegend />', () => {
  const labels = [ 'foo', 'bar', 'baz', 'foo2', 'bar2' ];
  const colors = [ 'foo_color', 'bar_color', 'baz_color' ];
  const defaultColor = 'red';
  const datasets = [ Mock.of<ChartDataset>({ backgroundColor: colors }) ];
  const chart = Mock.of<Chart>({
    config: {
      data: { labels, datasets },
      options: { defaultColor } as any,
    },
  });

  test('renders the expected amount of items with expected colors and labels', () => {
    const wrapper = shallow(<PieChartLegend chart={chart} />);
    const items = wrapper.find('li');

    expect.assertions(labels.length * 2 + 1);
    expect(items).toHaveLength(labels.length);
    labels.forEach((label, index) => {
      const item = items.at(index);

      expect(item.find('.pie-chart-legend__item-color').prop('style')).toEqual({
        backgroundColor: colors[index] ?? defaultColor,
      });
      expect(item.find('.pie-chart-legend__item-text').text()).toEqual(label);
    });
  });
});
