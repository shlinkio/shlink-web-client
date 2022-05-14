import { shallow, ShallowWrapper } from 'enzyme';
import { CardHeader, DropdownItem } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import { formatISO, subDays, subMonths, subYears } from 'date-fns';
import { Mock } from 'ts-mockery';
import LineChartCard from '../../../src/visits/charts/LineChartCard';
import ToggleSwitch from '../../../src/utils/ToggleSwitch';
import { NormalizedVisit } from '../../../src/visits/types';
import { prettify } from '../../../src/utils/helpers/numbers';
import { pointerOnHover, renderChartLabel } from '../../../src/utils/helpers/charts';

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
    [[], 'monthly'],
    [[{ date: formatISO(subDays(new Date(), 1)) }], 'hourly'],
    [[{ date: formatISO(subDays(new Date(), 3)) }], 'daily'],
    [[{ date: formatISO(subMonths(new Date(), 2)) }], 'weekly'],
    [[{ date: formatISO(subMonths(new Date(), 6)) }], 'weekly'],
    [[{ date: formatISO(subMonths(new Date(), 7)) }], 'monthly'],
    [[{ date: formatISO(subYears(new Date(), 1)) }], 'monthly'],
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
      plugins: {
        legend: { display: false },
        tooltip: {
          intersect: false,
          axis: 'x',
          callbacks: { label: renderChartLabel },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            callback: prettify,
          },
        },
        x: {
          title: { display: true, text: 'Month' },
        },
      },
      onHover: pointerOnHover,
    }));
  });

  it.each([
    [[Mock.of<NormalizedVisit>({ date: '2016-04-01' })], [], 1],
    [[Mock.of<NormalizedVisit>({ date: '2016-04-01' })], [Mock.of<NormalizedVisit>({ date: '2016-04-01' })], 2],
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
