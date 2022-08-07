import { screen } from '@testing-library/react';
import { OrphanVisitType, VisitsFilter } from '../../../src/visits/types';
import { VisitsFilterDropdown } from '../../../src/visits/helpers/VisitsFilterDropdown';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<VisitsFilterDropdown />', () => {
  const onChange = jest.fn();
  const setUp = (selected: VisitsFilter = {}, isOrphanVisits = true, botsSupported = true) => renderWithEvents(
    <VisitsFilterDropdown
      isOrphanVisits={isOrphanVisits}
      botsSupported={botsSupported}
      selected={selected}
      onChange={onChange}
    />,
  );

  beforeEach(jest.clearAllMocks);

  it('has expected text', () => {
    setUp();
    expect(screen.getByRole('button', { name: 'Filters' })).toBeInTheDocument();
  });

  it.each([
    [false, 1, 1],
    [true, 4, 2],
  ])('renders expected amount of items', async (isOrphanVisits, expectedItemsAmount, expectedHeadersAmount) => {
    const { user } = setUp({}, isOrphanVisits);

    await user.click(screen.getByRole('button', { name: 'Filters' }));

    expect(screen.getAllByRole('menuitem')).toHaveLength(expectedItemsAmount);
    expect(screen.getAllByRole('heading')).toHaveLength(expectedHeadersAmount);
  });

  it.each([
    ['base_url' as OrphanVisitType, 1, 1],
    ['invalid_short_url' as OrphanVisitType, 2, 1],
    ['regular_404' as OrphanVisitType, 3, 1],
    [undefined, -1, 0],
  ])('sets expected item as active', async (orphanVisitsType, expectedSelectedIndex, expectedActiveItems) => {
    const { user } = setUp({ orphanVisitsType });

    await user.click(screen.getByRole('button', { name: 'Filters' }));

    const items = screen.getAllByRole('menuitem');
    const activeItem = items.filter((item) => item.classList.contains('active'));

    expect.assertions(expectedActiveItems + 1);
    expect(activeItem).toHaveLength(expectedActiveItems);
    items.forEach((item, index) => {
      if (item.classList.contains('active')) {
        expect(index).toEqual(expectedSelectedIndex);
      }
    });
  });

  it.each([
    [0, { excludeBots: true }, {}],
    [1, { orphanVisitsType: 'base_url' }, {}],
    [2, { orphanVisitsType: 'invalid_short_url' }, {}],
    [3, { orphanVisitsType: 'regular_404' }, {}],
    [4, {}, { excludeBots: true }],
  ])('invokes onChange with proper selection when an item is clicked', async (index, expectedSelection, selected) => {
    const { user } = setUp(selected);

    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getAllByRole('menuitem')[index]);
    expect(onChange).toHaveBeenCalledWith(expectedSelection);
  });

  it('does not render the component when neither orphan visits or bots filtering will be displayed', () => {
    const { container } = setUp({}, false, false);
    expect(container.firstChild).toBeNull();
  });
});
