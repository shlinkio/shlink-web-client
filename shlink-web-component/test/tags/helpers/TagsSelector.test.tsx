import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { TagsSelector as createTagsSelector } from '../../../src/tags/helpers/TagsSelector';
import type { TagsList } from '../../../src/tags/reducers/tagsList';
import type { TagFilteringMode } from '../../../src/utils/settings';
import { SettingsProvider } from '../../../src/utils/settings';
import { renderWithEvents } from '../../__helpers__/setUpTest';
import { colorGeneratorMock } from '../../utils/services/__mocks__/ColorGenerator.mock';

type SetUpOptions = {
  allowNew?: boolean;
  allTags?: string[];
  tagFilteringMode?: TagFilteringMode;
};

describe('<TagsSelector />', () => {
  const onChange = vi.fn();
  const TagsSelector = createTagsSelector(colorGeneratorMock);
  const tags = ['foo', 'bar'];
  const setUp = ({ allowNew = true, allTags, tagFilteringMode }: SetUpOptions = {}) => renderWithEvents(
    <SettingsProvider
      value={fromPartial({
        shortUrlCreation: { tagFilteringMode },
      })}
    >
      <TagsSelector
        selectedTags={tags}
        tagsList={fromPartial<TagsList>({ tags: allTags ?? [...tags, 'baz'] })}
        listTags={vi.fn()}
        onChange={onChange}
        allowNew={allowNew}
      />
    </SettingsProvider>,
  );

  it('has an input for tags', () => {
    setUp();
    expect(screen.getByPlaceholderText('Add tags to the URL')).toBeInTheDocument();
  });

  it('contains expected tags', () => {
    setUp();

    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
  });

  it('contains expected suggestions', async () => {
    const { container, user } = setUp();

    expect(container.querySelector('.react-tags__listbox')).not.toBeInTheDocument();
    expect(screen.queryByText('baz')).not.toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Add tags to the URL'), 'ba');

    expect(container.querySelector('.react-tags__listbox')).toBeInTheDocument();
    expect(screen.getByText('baz')).toBeInTheDocument();
  });

  it('limits the amount of suggestions', async () => {
    const { user } = setUp({ allTags: ['foo', 'foo1', 'foo2', 'foo3', 'foo4', 'foo5', 'foo6', 'foo7'] });

    await user.type(screen.getByPlaceholderText('Add tags to the URL'), 'fo');

    // First results are in the document
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('foo1')).toBeInTheDocument();
    expect(screen.getByText('foo2')).toBeInTheDocument();
    expect(screen.getByText('foo3')).toBeInTheDocument();
    expect(screen.getByText('foo4')).toBeInTheDocument();
    expect(screen.getByText('foo5')).toBeInTheDocument();
    // While the last ones are not
    expect(screen.queryByText('foo6')).not.toBeInTheDocument();
    expect(screen.queryByText('foo7')).not.toBeInTheDocument();
  });

  it.each([
    ['The-New-Tag', [...tags, 'the-new-tag']],
    ['AnOTH   er  tag  ', [...tags, 'anoth-er-tag']],
    // ['foo', tags], TODO Test that existing tags are ignored
  ])('invokes onChange when new tags are added', async (newTag, expectedTags) => {
    const { user } = setUp();

    expect(onChange).not.toHaveBeenCalled();
    await user.type(screen.getByPlaceholderText('Add tags to the URL'), newTag);
    await user.type(screen.getByPlaceholderText('Add tags to the URL'), '{Enter}');
    expect(onChange).toHaveBeenCalledWith(expectedTags);
  });

  it('splits tags when several comma-separated ones are pasted', async () => {
    const { user } = setUp();

    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByPlaceholderText('Add tags to the URL'));
    await user.paste('comma,separated,tags');
    await user.type(screen.getByPlaceholderText('Add tags to the URL'), '{Enter}');
    expect(onChange).toHaveBeenCalledWith([...tags, 'comma', 'separated', 'tags']);
  });

  it.each([
    ['foo', 'bar'],
    ['bar', 'foo'],
  ])('invokes onChange when tags are deleted', async (removedLabel, expected) => {
    const { user } = setUp();

    await user.click(screen.getByLabelText(`Remove ${removedLabel}`));
    expect(onChange).toHaveBeenCalledWith([expected]);
  });

  it('displays "Add tag" option for new tags', async () => {
    const { user } = setUp();

    expect(screen.queryByText(/^Add "/)).not.toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('Add tags to the URL'), 'new-tag');
    expect(screen.getByText(/^Add "/)).toBeInTheDocument();
  });

  it('displays "Tag not found" for unknown tags when add is not allowed', async () => {
    const { user } = setUp({ allowNew: false });

    expect(screen.queryByText('Tag not found')).not.toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('Add tags to the URL'), 'not-found-tag');
    expect(screen.getByText('Tag not found')).toBeInTheDocument();
  });

  it.each([
    ['startsWith' as TagFilteringMode, ['foo', 'foobar']],
    ['includes' as TagFilteringMode, ['foo', 'barfoo', 'foobar']],
  ])('filters suggestions with different algorithm based on filtering mode', async (tagFilteringMode, expectedTags) => {
    const { user } = setUp({ tagFilteringMode, allTags: ['foo', 'barfoo', 'foobar'] });

    await user.type(screen.getByPlaceholderText('Add tags to the URL'), ' Foo');

    expectedTags.forEach((tag) => expect(screen.getByText(tag)).toBeInTheDocument());
  });
});
