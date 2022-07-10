import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formatISO, subDays, subMonths, subYears } from 'date-fns';
import { Mock } from 'ts-mockery';
import { LineChartCard } from '../../../src/visits/charts/LineChartCard';
import { NormalizedVisit } from '../../../src/visits/types';
import { setUpCanvas } from '../../__helpers__/setUpTest';

describe('<LineChartCard />', () => {
  const setUp = (visits: NormalizedVisit[] = [], highlightedVisits: NormalizedVisit[] = []) => ({
    user: userEvent.setup(),
    ...setUpCanvas(<LineChartCard title="Cool title" visits={visits} highlightedVisits={highlightedVisits} />),
  });

  it('renders provided title', () => {
    setUp();
    expect(screen.getByRole('heading')).toHaveTextContent('Cool title');
  });

  it.each([
    [[], 0],
    [[{ date: formatISO(subDays(new Date(), 1)) }], 3],
    [[{ date: formatISO(subDays(new Date(), 3)) }], 2],
    [[{ date: formatISO(subMonths(new Date(), 2)) }], 1],
    [[{ date: formatISO(subMonths(new Date(), 6)) }], 1],
    [[{ date: formatISO(subMonths(new Date(), 7)) }], 0],
    [[{ date: formatISO(subYears(new Date(), 1)) }], 0],
  ])('renders group menu and selects proper grouping item based on visits dates', async (
    visits,
    expectedActiveIndex,
  ) => {
    const { user } = setUp(visits.map((visit) => Mock.of<NormalizedVisit>(visit)));

    await user.click(screen.getByRole('button', { name: /Group by/ }));

    const items = screen.getAllByRole('menuitem');

    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent('Month');
    expect(items[1]).toHaveTextContent('Week');
    expect(items[2]).toHaveTextContent('Day');
    expect(items[3]).toHaveTextContent('Hour');
    expect(items[expectedActiveIndex]).toHaveAttribute('class', expect.stringContaining('active'));
  });

  it.each([
    [undefined, undefined],
    [[], []],
    [[Mock.of<NormalizedVisit>({ date: '2016-04-01' })], []],
    [[Mock.of<NormalizedVisit>({ date: '2016-04-01' })], [Mock.of<NormalizedVisit>({ date: '2016-04-01' })]],
  ])('renders chart with expected data', (visits, highlightedVisits) => {
    const { events } = setUp(visits, highlightedVisits);

    expect(events).toBeTruthy();
    expect(events).toMatchSnapshot();
  });

  it('includes stats for visits with no dates if selected', async () => {
    const { getEvents, user } = setUp([
      Mock.of<NormalizedVisit>({ date: '2016-04-01' }),
      Mock.of<NormalizedVisit>({ date: '2016-01-01' }),
    ]);

    const eventsBefore = getEvents();
    await user.click(screen.getByLabelText('Skip dates with no visits'));
    expect(eventsBefore).not.toEqual(getEvents());
  });
});
