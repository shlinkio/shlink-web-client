import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import { keys, values } from 'ramda';
import DefaultChart from '../../../src/visits/helpers/DefaultChart';

describe('<DefaultChart />', () => {
  let wrapper: ShallowWrapper;
  const stats = {
    foo: 123,
    bar: 456,
  };

  afterEach(() => wrapper?.unmount());

  it('renders Doughnut when is not a bar chart', () => {
    wrapper = shallow(<DefaultChart title="The chart" stats={stats} />);
    const doughnut = wrapper.find(Doughnut);
    const horizontal = wrapper.find(HorizontalBar);
    const cols = wrapper.find('.col-sm-12');

    expect(doughnut).toHaveLength(1);
    expect(horizontal).toHaveLength(0);

    const { labels, datasets } = doughnut.prop('data') as any;
    const [{ title, data, backgroundColor, borderColor }] = datasets;
    const { legend, legendCallback, scales } = doughnut.prop('options') ?? {};

    expect(title).toEqual('The chart');
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
    expect(legend).toEqual({ display: false });
    expect(typeof legendCallback).toEqual('function');
    expect(scales).toBeUndefined();
    expect(cols).toHaveLength(2);
  });

  it('renders HorizontalBar when is not a bar chart', () => {
    wrapper = shallow(<DefaultChart isBarChart title="The chart" stats={stats} />);
    const doughnut = wrapper.find(Doughnut);
    const horizontal = wrapper.find(HorizontalBar);
    const cols = wrapper.find('.col-sm-12');

    expect(doughnut).toHaveLength(0);
    expect(horizontal).toHaveLength(1);

    const { datasets: [{ backgroundColor, borderColor }] } = horizontal.prop('data') as any;
    const { legend, legendCallback, scales } = horizontal.prop('options') ?? {};

    expect(backgroundColor).toEqual('rgba(70, 150, 229, 0.4)');
    expect(borderColor).toEqual('rgba(70, 150, 229, 1)');
    expect(legend).toEqual({ display: false });
    expect(legendCallback).toEqual(false);
    expect(scales).toEqual({
      xAxes: [
        {
          ticks: { beginAtZero: true, precision: 0 },
          stacked: true,
        },
      ],
      yAxes: [{ stacked: true }],
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
    wrapper = shallow(<DefaultChart isBarChart title="The chart" stats={stats} highlightedStats={highlightedStats} />);
    const horizontal = wrapper.find(HorizontalBar);

    const { datasets: [{ data, label }, highlightedData ] } = horizontal.prop('data') as any;

    expect(label).toEqual(highlightedStats ? 'Non-selected' : 'Visits');
    expect(data).toEqual(expectedData);
    expectedHighlightedData && expect(highlightedData.data).toEqual(expectedHighlightedData);
    !expectedHighlightedData && expect(highlightedData).toBeUndefined();
  });
});
