import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { Settings, TagsMode, TagsSettings as TagsSettingsOptions } from '../../src/settings/reducers/settings';
import { TagsSettings } from '../../src/settings/TagsSettings';
import { TagsOrder } from '../../src/tags/data/TagsListChildrenProps';
import { capitalize } from '../../src/utils/utils';

describe('<TagsSettings />', () => {
  const setTagsSettings = jest.fn();
  const setUp = (tags?: TagsSettingsOptions) => ({
    user: userEvent.setup(),
    ...render(<TagsSettings settings={Mock.of<Settings>({ tags })} setTagsSettings={setTagsSettings} />),
  });

  afterEach(jest.clearAllMocks);

  it('renders expected amount of groups', () => {
    setUp();

    expect(screen.getByText('Default display mode when managing tags:')).toBeInTheDocument();
    expect(screen.getByText('Default ordering for tags list:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Order by...' })).toBeInTheDocument();
  });

  it.each([
    [undefined, 'cards'],
    [{}, 'cards'],
    [{ defaultMode: 'cards' as TagsMode }, 'cards'],
    [{ defaultMode: 'list' as TagsMode }, 'list'],
  ])('shows expected tags displaying mode', (tags, expectedMode) => {
    const { container } = setUp(tags);

    expect(screen.getByRole('button', { name: capitalize(expectedMode) })).toBeInTheDocument();
    expect(container.querySelector('.form-text')).toHaveTextContent(`Tags will be displayed as ${expectedMode}.`);
  });

  it.each([
    ['cards' as TagsMode],
    ['list' as TagsMode],
  ])('invokes setTagsSettings when tags mode changes', async (defaultMode) => {
    const { user } = setUp();

    expect(setTagsSettings).not.toHaveBeenCalled();
    await user.click(screen.getByText('List'));
    await user.click(screen.getByRole('menuitem', { name: capitalize(defaultMode) }));
    expect(setTagsSettings).toHaveBeenCalledWith({ defaultMode });
  });

  it.each([
    [undefined, 'Order by...'],
    [{}, 'Order by...'],
    [{ defaultOrdering: {} }, 'Order by...'],
    [{ defaultOrdering: { field: 'tag', dir: 'DESC' } as TagsOrder }, 'Order by: Tag - DESC'],
    [{ defaultOrdering: { field: 'visits', dir: 'ASC' } as TagsOrder }, 'Order by: Visits - ASC'],
  ])('shows expected ordering', (tags, expectedOrder) => {
    setUp(tags);
    expect(screen.getByRole('button', { name: expectedOrder })).toBeInTheDocument();
  });

  it.each([
    ['Tag', 'tag', 'ASC'],
    ['Visits', 'visits', 'ASC'],
    ['Short URLs', 'shortUrls', 'ASC'],
  ])('invokes setTagsSettings when ordering changes', async (name, field, dir) => {
    const { user } = setUp();

    expect(setTagsSettings).not.toHaveBeenCalled();
    await user.click(screen.getByText('Order by...'));
    await user.click(screen.getByRole('menuitem', { name }));
    expect(setTagsSettings).toHaveBeenCalledWith({ defaultOrdering: { field, dir } });
  });
});
