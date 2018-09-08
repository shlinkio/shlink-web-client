import React from 'react';
import { shallow } from 'enzyme';
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
import { keys, values } from 'ramda';
import { GraphCard } from '../../src/visits/GraphCard';

describe('<GraphCard />', () => {
  let wrapper;
  const stats = {
    foo: 123,
    bar: 456,
  };

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('renders Doughnut when is not a bar chart', () => {
    wrapper = shallow(<GraphCard title="The chart" stats={stats} />);
    const doughnut = wrapper.find(Doughnut);
    const horizontal = wrapper.find(HorizontalBar);

    expect(doughnut).toHaveLength(1);
    expect(horizontal).toHaveLength(0);

    const { labels, datasets: [{ title, data, backgroundColor, borderColor }] } = doughnut.prop('data');
    const { legend, scales } = doughnut.prop('options');

    expect(title).toEqual('The chart');
    expect(labels).toEqual(keys(stats));
    expect(data).toEqual(values(stats));
    expect(backgroundColor).toEqual([
      '#97BBCD',
      '#DCDCDC',
      '#F7464A',
      '#46BFBD',
      '#FDB45C',
      '#949FB1',
      '#4D5360',
    ]);
    expect(borderColor).toEqual('white');
    expect(legend).toEqual({ position: 'right' });
    expect(scales).toBeNull();
  });

  it('renders HorizontalBar when is not a bar chart', () => {
    wrapper = shallow(<GraphCard isBarChart title="The chart" stats={stats} />);
    const doughnut = wrapper.find(Doughnut);
    const horizontal = wrapper.find(HorizontalBar);

    expect(doughnut).toHaveLength(0);
    expect(horizontal).toHaveLength(1);

    const { datasets: [{ backgroundColor, borderColor }] } = horizontal.prop('data');
    const { legend, scales } = horizontal.prop('options');

    expect(backgroundColor).toEqual('rgba(70, 150, 229, 0.4)');
    expect(borderColor).toEqual('rgba(70, 150, 229, 1)');
    expect(legend).toEqual({ display: false });
    expect(scales).toEqual({
      xAxes: [
        {
          ticks: { beginAtZero: true },
        },
      ],
    });
  });
});
