import type { TagsSettings as TagsSettingsOptions } from '@shlinkio/shlink-web-component';
import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { TagsOrder } from '../../src/settings/TagsSettings';
import { TagsSettings } from '../../src/settings/TagsSettings';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<TagsSettings />', () => {
  const setTagsSettings = vi.fn();
  const setUp = (tags?: TagsSettingsOptions) => renderWithEvents(
    <TagsSettings settings={fromPartial({ tags })} setTagsSettings={setTagsSettings} />,
  );

  it('passes a11y checks', () => checkAccessibility(setUp()));

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
