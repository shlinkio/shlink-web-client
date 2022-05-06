import { render } from '@testing-library/react';
import { HorizontalBarChart, HorizontalBarChartProps } from '../../../src/visits/charts/HorizontalBarChart';

describe('<HorizontalBarChart />', () => {
  const setUp = (props: HorizontalBarChartProps) => {
    const { container } = render(<HorizontalBarChart {...props} />);
    return container.querySelector('canvas')?.getContext('2d')?.__getEvents(); // eslint-disable-line no-underscore-dangle
  };

  it.each([
    [{ foo: 123, bar: 456 }, undefined],
    [{ one: 999, two: 131313 }, { one: 30, two: 100 }],
    [{ one: 999, two: 131313, max: 3 }, { one: 30, two: 100 }],
  ])('renders chart with expected canvas', (stats, highlightedStats) => {
    const events = setUp({ stats, highlightedStats });

    expect(events).toBeTruthy();
    expect(events).toMatchSnapshot();
  });
});
