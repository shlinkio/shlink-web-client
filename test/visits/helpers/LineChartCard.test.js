import React from 'react';
import { shallow } from 'enzyme';
import { CardHeader, DropdownItem } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import LineChartCard from '../../../src/visits/helpers/LineChartCard';
import ToggleSwitch from '../../../src/utils/ToggleSwitch';

describe('<LineChartCard />', () => {
  let wrapper;
  const createWrapper = (visits = [], highlightedVisits = []) => {
    wrapper = shallow(<LineChartCard title="Cool title" visits={visits} highlightedVisits={highlightedVisits} />);

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

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
    const wrapper = createWrapper(visits);
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

    expect(chart.prop('options')).toEqual({
      maintainAspectRatio: false,
      legend: { display: false },
      scales: {
        yAxes: [
          {
            ticks: { beginAtZero: true, precision: 0 },
          },
        ],
        xAxes: [
          {
            scaleLabel: { display: true, labelString: 'Month' },
          },
        ],
      },
      tooltips: {
        intersect: false,
        axis: 'x',
      },
    });
  });

  it.each([
    [[{}], [], 1 ],
    [[{}], [{}], 2 ],
  ])('renders chart with expected data', (visits, highlightedVisits, expectedLines) => {
    const wrapper = createWrapper(visits, highlightedVisits);
    const chart = wrapper.find(Line);
    const { datasets } = chart.prop('data');

    expect(datasets).toHaveLength(expectedLines);
  });

  it('includes stats for visits with no dates if selected', () => {
    const wrapper = createWrapper([
      { date: '2016-04-01' },
      { date: '2016-01-01' },
    ]);

    expect(wrapper.find(Line).prop('data').labels).toHaveLength(2);
    wrapper.find(ToggleSwitch).simulate('change');
    expect(wrapper.find(Line).prop('data').labels).toHaveLength(4);
  });
});
