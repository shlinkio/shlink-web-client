import { screen } from '@testing-library/react';
import { PaginationDropdown } from '../../shlink-web-component/src/utils/components/PaginationDropdown';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<PaginationDropdown />', () => {
  const setValue = vi.fn();
  const setUp = async () => {
    const result = renderWithEvents(<PaginationDropdown ranges={[10, 50, 100, 200]} value={50} setValue={setValue} />);
    const { user } = result;

    await user.click(screen.getByRole('button'));

    return result;
  };

  it('renders expected amount of items', async () => {
    await setUp();
    expect(screen.getAllByRole('menuitem')).toHaveLength(5);
  });

  it.each([
    [0, 10],
    [1, 50],
    [2, 100],
    [3, 200],
  ])('sets expected value when an item is clicked', async (index, expectedValue) => {
    const { user } = await setUp();

    expect(setValue).not.toHaveBeenCalled();
    await user.click(screen.getAllByRole('menuitem')[index]);
    expect(setValue).toHaveBeenCalledWith(expectedValue);
  });
});
