import { shallow, ShallowWrapper } from 'enzyme';
import { Doughnut, Bar } from 'react-chartjs-2';
import { keys, values } from 'ramda';
import DefaultChart from '../../../src/visits/helpers/DefaultChart';
import { prettify } from '../../../src/utils/helpers/numbers';
import { MAIN_COLOR, MAIN_COLOR_ALPHA } from '../../../src/utils/theme';

describe('<DefaultChart />', () => {
  let wrapper: ShallowWrapper;
  const stats = {
    foo: 123,
    bar: 456,
  };

  afterEach(() => wrapper?.unmount());

  it('renders Doughnut when is not a bar chart', () => {
    wrapper = shallow(<DefaultChart stats={stats} />);
    const doughnut = wrapper.find(Doughnut);
    const horizontal = wrapper.find(Bar);
    const cols = wrapper.find('.col-sm-12');

    expect(doughnut).toHaveLength(1);
    expect(horizontal).toHaveLength(0);

    const { labels, datasets } = doughnut.prop('data');
    const [{ data, backgroundColor, borderColor }] = datasets;
    const { plugins, scales } = doughnut.prop('options') ?? {};

    expect(labels).toEqual(keys(stats));
    expect(data).toEqual(values(stats));
    expect(datasets).toHaveLength(1);
    expect(backgroundColor).toEqual([
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
    ]);
    expect(borderColor).toEqual('white');
    expect(plugins.legend).toEqual({ display: false });
    expect(scales).toBeUndefined();
    expect(cols).toHaveLength(2);
  });

  it('renders HorizontalBar when is not a bar chart', () => {
    wrapper = shallow(<DefaultChart isBarChart stats={stats} />);
    const doughnut = wrapper.find(Doughnut);
    const horizontal = wrapper.find(Bar);
    const cols = wrapper.find('.col-sm-12');

    expect(doughnut).toHaveLength(0);
    expect(horizontal).toHaveLength(1);

    const { datasets: [{ backgroundColor, borderColor }] } = horizontal.prop('data');
    const { plugins, scales } = horizontal.prop('options') ?? {};

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
    expect(cols).toHaveLength(1);
  });

  it.each([
    [{ foo: 23 }, [ 100, 456 ], [ 23, 0 ]],
    [{ foo: 50 }, [ 73, 456 ], [ 50, 0 ]],
    [{ bar: 45 }, [ 123, 411 ], [ 0, 45 ]],
    [{ bar: 20, foo: 13 }, [ 110, 436 ], [ 13, 20 ]],
    [ undefined, [ 123, 456 ], undefined ],
  ])('splits highlighted data from regular data', (highlightedStats, expectedData, expectedHighlightedData) => {
    wrapper = shallow(<DefaultChart isBarChart stats={stats} highlightedStats={highlightedStats} />);
    const horizontal = wrapper.find(Bar);

    const { datasets: [{ data, label }, highlightedData ] } = horizontal.prop('data');

    expect(label).toEqual('Visits');
    expect(data).toEqual(expectedData);
    expectedHighlightedData && expect(highlightedData.data).toEqual(expectedHighlightedData);
    !expectedHighlightedData && expect(highlightedData).toBeUndefined();
  });
});
