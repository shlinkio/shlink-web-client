import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { CardHeader, DropdownItem } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { Mock } from 'ts-mockery';
import LineChartCard from '../../../src/visits/helpers/LineChartCard';
import ToggleSwitch from '../../../src/utils/ToggleSwitch';
import { NormalizedVisit } from '../../../src/visits/types';
import { prettify } from '../../../src/utils/helpers/numbers';

describe('<LineChartCard />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (visits: NormalizedVisit[] = [], highlightedVisits: NormalizedVisit[] = []) => {
    wrapper = shallow(<LineChartCard title="Cool title" visits={visits} highlightedVisits={highlightedVisits} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it('renders provided title', () => {
    const wrapper = createWrapper();
    const header = wrapper.find(CardHeader);

    expect(header.html()).toContain('Cool title');
  });

  it.each([
    [[], 'monthly' ],
    [[{ date: moment().subtract(1, 'day').format() }], 'hourly' ],
    [[{ date: moment().subtract(3, 'day').format() }], 'daily' ],
    [[{ date: moment().subtract(2, 'month').format() }], 'weekly' ],
    [[{ date: moment().subtract(6, 'month').format() }], 'weekly' ],
    [[{ date: moment().subtract(7, 'month').format() }], 'monthly' ],
    [[{ date: moment().subtract(1, 'year').format() }], 'monthly' ],
  ])('renders group menu and selects proper grouping item based on visits dates', (visits, expectedActiveItem) => {
    const wrapper = createWrapper(visits.map((visit) => Mock.of<NormalizedVisit>(visit)));
    const items = wrapper.find(DropdownItem);

    expect(items).toHaveLength(4);
    expect(items.at(0).prop('children')).toEqual('Month');
    expect(items.at(0).prop('active')).toEqual(expectedActiveItem === 'monthly');
    expect(items.at(1).prop('children')).toEqual('Week');
    expect(items.at(1).prop('active')).toEqual(expectedActiveItem === 'weekly');
    expect(items.at(2).prop('children')).toEqual('Day');
    expect(items.at(2).prop('active')).toEqual(expectedActiveItem === 'daily');
    expect(items.at(3).prop('children')).toEqual('Hour');
    expect(items.at(3).prop('active')).toEqual(expectedActiveItem === 'hourly');
  });

  it('renders chart with expected options', () => {
    const wrapper = createWrapper();
    const chart = wrapper.find(Line);

    expect(chart.prop('options')).toEqual(expect.objectContaining({
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        yAxes: [
          {
            ticks: { beginAtZero: true, precision: 0, callback: prettify },
          },
        ],
        xAxes: [
          {
            scaleLabel: { display: true, labelString: 'Month' },
          },
        ],
      },
      tooltips: expect.objectContaining({
        intersect: false,
        axis: 'x',
      }),
    }));
  });

  it.each([
    [[ Mock.of<NormalizedVisit>({}) ], [], 1 ],
    [[ Mock.of<NormalizedVisit>({}) ], [ Mock.of<NormalizedVisit>({}) ], 2 ],
  ])('renders chart with expected data', (visits, highlightedVisits, expectedLines) => {
    const wrapper = createWrapper(visits, highlightedVisits);
    const chart = wrapper.find(Line);
    const { datasets } = chart.prop('data') as any;

    expect(datasets).toHaveLength(expectedLines);
  });

  it('includes stats for visits with no dates if selected', () => {
    const wrapper = createWrapper([
      Mock.of<NormalizedVisit>({ date: '2016-04-01' }),
      Mock.of<NormalizedVisit>({ date: '2016-01-01' }),
    ]);

    expect((wrapper.find(Line).prop('data') as any).labels).toHaveLength(2);
    wrapper.find(ToggleSwitch).simulate('change');
    expect((wrapper.find(Line).prop('data') as any).labels).toHaveLength(4);
  });
});
