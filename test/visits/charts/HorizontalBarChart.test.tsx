import type { HorizontalBarChartProps } from '../../../src/shlink-web-component/visits/charts/HorizontalBarChart';
import { HorizontalBarChart } from '../../../src/shlink-web-component/visits/charts/HorizontalBarChart';
import { setUpCanvas } from '../../__helpers__/setUpTest';

describe('<HorizontalBarChart />', () => {
  const setUp = (props: HorizontalBarChartProps) => setUpCanvas(<HorizontalBarChart {...props} />);

  it.each([
    [{ foo: 123, bar: 456 }, undefined],
    [{ one: 999, two: 131313 }, { one: 30, two: 100 }],
    [{ one: 999, two: 131313, max: 3 }, { one: 30, two: 100 }],
  ])('renders chart with expected canvas', (stats, highlightedStats) => {
    const { events } = setUp({ stats, highlightedStats });

    expect(events).toBeTruthy();
    expect(events).toMatchSnapshot();
  });
});
