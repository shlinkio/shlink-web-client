import { screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { rangeOf } from '../../src/utils/helpers';
import type { NormalizedVisit } from '../../src/visits/types';
import type { VisitsTableProps } from '../../src/visits/VisitsTable';
import { VisitsTable } from '../../src/visits/VisitsTable';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<VisitsTable />', () => {
  const matchMedia = () => fromPartial<MediaQueryList>({ matches: false });
  const setSelectedVisits = vi.fn();
  const setUpFactory = (props: Partial<VisitsTableProps> = {}) => renderWithEvents(
    <VisitsTable
      visits={[]}
      {...props}
      matchMedia={matchMedia}
      setSelectedVisits={setSelectedVisits}
    />,
  );
  const setUp = (visits: NormalizedVisit[], selectedVisits: NormalizedVisit[] = []) => setUpFactory(
    { visits, selectedVisits },
  );
  const setUpForOrphanVisits = (isOrphanVisits: boolean) => setUpFactory({ isOrphanVisits });
  const setUpWithBots = () => setUpFactory({
    visits: [
      fromPartial({ potentialBot: false, date: '2022-05-05' }),
      fromPartial({ potentialBot: true, date: '2022-05-05' }),
    ],
  });

  it('renders expected amount of columns', () => {
    setUp([], []);
    expect(screen.getAllByRole('columnheader')).toHaveLength(8);
  });

  it('shows warning when no visits are found', () => {
    setUp([]);
    expect(screen.getByText('No visits found with current filtering')).toBeInTheDocument();
  });

  it.each([
    [50, 5, 1],
    [21, 4, 1],
    [30, 4, 1],
    [60, 5, 1],
    [115, 7, 2], // This one will have ellipsis
  ])('renders the expected amount of pages', (visitsCount, expectedAmountOfPageItems, expectedDisabledItems) => {
    const { container } = setUp(
      rangeOf(visitsCount, () => fromPartial<NormalizedVisit>({ browser: '', date: '2022-01-01', referer: '' })),
    );
    expect(container.querySelectorAll('.page-item')).toHaveLength(expectedAmountOfPageItems);
    expect(container.querySelectorAll('.disabled')).toHaveLength(expectedDisabledItems);
  });

  it.each(
    rangeOf(20, (value) => [value]),
  )('does not render footer when there is only one page to render', (visitsCount) => {
    const { container } = setUp(
      rangeOf(visitsCount, () => fromPartial<NormalizedVisit>({ browser: '', date: '2022-01-01', referer: '' })),
    );

    expect(container.querySelector('tfoot')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('pagination')).not.toBeInTheDocument();
  });

  it('selected rows are highlighted', async () => {
    const visits = rangeOf(10, () => fromPartial<NormalizedVisit>({ browser: '', date: '2022-01-01', referer: '' }));
    const { container, user } = setUp(visits, [visits[1], visits[2]]);

    // Initial situation
    expect(container.querySelectorAll('.table-active')).toHaveLength(2);

    // Select one extra
    await user.click(screen.getAllByRole('row')[5]);
    expect(setSelectedVisits).toHaveBeenCalledWith([visits[1], visits[2], visits[4]]);

    // Deselect one
    await user.click(screen.getAllByRole('row')[3]);
    expect(setSelectedVisits).toHaveBeenCalledWith([visits[1]]);

    // Select all
    await user.click(screen.getAllByRole('columnheader')[0]);
    expect(setSelectedVisits).toHaveBeenCalledWith(visits);
  });

  it('orders visits when column is clicked', async () => {
    const { user } = setUp(rangeOf(9, (index) => fromPartial<NormalizedVisit>({
      browser: '',
      date: `2022-01-0${10 - index}`,
      referer: `${index}`,
      country: `Country_${index}`,
    })));
    const getFirstColumnValue = () => screen.getAllByRole('row')[2]?.querySelectorAll('td')[3]?.textContent;
    const clickColumn = async (index: number) => user.click(screen.getAllByRole('columnheader')[index]);

    expect(getFirstColumnValue()).toContain('Country_1');
    await clickColumn(2); // Date column ASC
    expect(getFirstColumnValue()).toContain('Country_9');
    await clickColumn(7); // Referer column - ASC
    expect(getFirstColumnValue()).toContain('Country_1');
    await clickColumn(7); // Referer column - DESC
    expect(getFirstColumnValue()).toContain('Country_9');
    await clickColumn(7); // Referer column - reset
    expect(getFirstColumnValue()).toContain('Country_1');
  });

  it('filters list when writing in search box', async () => {
    const { user } = setUp([
      ...rangeOf(7, () => fromPartial<NormalizedVisit>({ browser: 'aaa', date: '2022-01-01', referer: 'aaa' })),
      ...rangeOf(2, () => fromPartial<NormalizedVisit>({ browser: 'bbb', date: '2022-01-01', referer: 'bbb' })),
    ]);
    const searchField = screen.getByPlaceholderText('Search...');
    const searchText = async (text: string) => {
      await user.clear(searchField);
      text.length > 0 && await user.type(searchField, text);
    };

    expect(screen.getAllByRole('row')).toHaveLength(9 + 2);
    await searchText('aa');
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(7 + 2));
    await searchText('bb');
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(2 + 2));
    await searchText('');
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(9 + 2));
  });

  it.each([
    [true, 9],
    [false, 8],
  ])('displays proper amount of columns for orphan and non-orphan visits', (isOrphanVisits, expectedCols) => {
    setUpForOrphanVisits(isOrphanVisits);
    expect(screen.getAllByRole('columnheader')).toHaveLength(expectedCols);
  });

  it('displays bots icon when a visit is a potential bot', () => {
    setUpWithBots();
    const [,, nonBotVisitRow, botVisitRow] = screen.getAllByRole('row');

    expect(nonBotVisitRow.querySelectorAll('td')[1]).toBeEmptyDOMElement();
    expect(botVisitRow.querySelectorAll('td')[1]).not.toBeEmptyDOMElement();
  });
});
