import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagsModeDropdown } from '../../src/tags/TagsModeDropdown';
import { TagsMode } from '../../src/settings/reducers/settings';

describe('<TagsModeDropdown />', () => {
  const onChange = jest.fn();
  const setUp = (mode: TagsMode) => ({
    user: userEvent.setup(),
    ...render(<TagsModeDropdown mode={mode} onChange={onChange} />),
  });

  afterEach(jest.clearAllMocks);

  it.each([
    ['cards' as TagsMode],
    ['list' as TagsMode],
  ])('renders expected initial value', (mode) => {
    setUp(mode);
    expect(screen.getByRole('button')).toHaveTextContent(`Display mode: ${mode}`);
  });

  it('changes active element on click', async () => {
    const { user } = setUp('list');
    const clickItem = async (index: 0 | 1) => {
      await user.click(screen.getByRole('button'));
      await user.click(screen.getAllByRole('menuitem')[index]);
    };

    expect(onChange).not.toHaveBeenCalled();
    await clickItem(0);
    expect(onChange).toHaveBeenCalledWith('cards');

    await clickItem(1);
    expect(onChange).toHaveBeenCalledWith('list');
  });
});
