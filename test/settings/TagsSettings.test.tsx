import { screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { Settings, TagsSettings as TagsSettingsOptions } from '../../src/settings/reducers/settings';
import { TagsSettings } from '../../src/settings/TagsSettings';
import { TagsOrder } from '../../src/tags/data/TagsListChildrenProps';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<TagsSettings />', () => {
  const setTagsSettings = vi.fn();
  const setUp = (tags?: TagsSettingsOptions) => renderWithEvents(
    <TagsSettings settings={Mock.of<Settings>({ tags })} setTagsSettings={setTagsSettings} />,
  );

  afterEach(vi.clearAllMocks);

  it('renders expected amount of groups', () => {
    setUp();

    expect(screen.getByText('Default ordering for tags list:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Order by...' })).toBeInTheDocument();
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
