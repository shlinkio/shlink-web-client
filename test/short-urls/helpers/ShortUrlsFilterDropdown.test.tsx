import { screen, waitFor } from '@testing-library/react';
import { ShortUrlsFilterDropdown } from '../../../shlink-web-component/src/short-urls/helpers/ShortUrlsFilterDropdown';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<ShortUrlsFilterDropdown />', () => {
  const setUp = (supportsDisabledFiltering: boolean) => renderWithEvents(
    <ShortUrlsFilterDropdown onChange={vi.fn()} supportsDisabledFiltering={supportsDisabledFiltering} />,
  );

  it.each([
    [true, 3],
    [false, 1],
  ])('displays proper amount of menu items', async (supportsDisabledFiltering, expectedItems) => {
    const { user } = setUp(supportsDisabledFiltering);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    expect(screen.getAllByRole('menuitem')).toHaveLength(expectedItems);
  });
});
