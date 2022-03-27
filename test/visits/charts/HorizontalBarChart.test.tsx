import { shallow, ShallowWrapper } from 'enzyme';
import { Bar } from 'react-chartjs-2';
import { prettify } from '../../../src/utils/helpers/numbers';
import { MAIN_COLOR, MAIN_COLOR_ALPHA } from '../../../src/utils/theme';
import { HorizontalBarChart } from '../../../src/visits/charts/HorizontalBarChart';

describe('<HorizontalBarChart />', () => {
  let wrapper: ShallowWrapper;
  const stats = {
    foo: 123,
    bar: 456,
  };

  afterEach(() => wrapper?.unmount());

  it('renders Bar with expected properties', () => {
    wrapper = shallow(<HorizontalBarChart stats={stats} />);
    const horizontal = wrapper.find(Bar);

    expect(horizontal).toHaveLength(1);

    const { datasets: [{ backgroundColor, borderColor }] } = horizontal.prop('data') as any;
    const { plugins, scales } = (horizontal.prop('options') ?? {}) as any;

    expect(backgroundColor).toEqual(MAIN_COLOR_ALPHA);
    expect(borderColor).toEqual(MAIN_COLOR);
    expect(plugins.legend).toEqual({ display: false });
    expect(scales).toEqual({
      x: {
        beginAtZero: true,
        stacked: true,
        ticks: {
          precision: 0,
          callback: prettify,
        },
      },
      y: { stacked: true },
    });
  });

  it.each([
    [{ foo: 23 }, [100, 456], [23, 0]],
    [{ foo: 50 }, [73, 456], [50, 0]],
    [{ bar: 45 }, [123, 411], [0, 45]],
    [{ bar: 20, foo: 13 }, [110, 436], [13, 20]],
    [undefined, [123, 456], undefined],
  ])('splits highlighted data from regular data', (highlightedStats, expectedData, expectedHighlightedData) => {
    wrapper = shallow(<HorizontalBarChart stats={stats} highlightedStats={highlightedStats} />);
    const horizontal = wrapper.find(Bar);

    const { datasets: [{ data, label }, highlightedData] } = horizontal.prop('data') as any;

    expect(label).toEqual('Visits');
    expect(data).toEqual(expectedData);
    expectedHighlightedData && expect(highlightedData.data).toEqual(expectedHighlightedData);
    !expectedHighlightedData && expect(highlightedData).toBeUndefined();
  });
});
