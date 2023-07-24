import { screen } from '@testing-library/react';
import { VisitsFilterDropdown } from '../../../shlink-web-component/visits/helpers/VisitsFilterDropdown';
import type { OrphanVisitType, VisitsFilter } from '../../../shlink-web-component/visits/types';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<VisitsFilterDropdown />', () => {
  const onChange = vi.fn();
  const setUp = (selected: VisitsFilter = {}, isOrphanVisits = true) => renderWithEvents(
    <VisitsFilterDropdown
      isOrphanVisits={isOrphanVisits}
      selected={selected}
      onChange={onChange}
    />,
  );

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
    [4, { orphanVisitsType: undefined, excludeBots: false }, { excludeBots: true }],
  ])('invokes onChange with proper selection when an item is clicked', async (index, expectedSelection, selected) => {
    const { user } = setUp(selected);

    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getAllByRole('menuitem')[index]);
    expect(onChange).toHaveBeenCalledWith(expectedSelection);
  });
});
