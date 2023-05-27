import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { TagsSelector as createTagsSelector } from '../../../src/tags/helpers/TagsSelector';
import type { TagsList } from '../../../src/tags/reducers/tagsList';
import { renderWithEvents } from '../../__helpers__/setUpTest';
import { colorGeneratorMock } from '../../utils/services/__mocks__/ColorGenerator.mock';

describe('<TagsSelector />', () => {
  const onChange = vi.fn();
  const TagsSelector = createTagsSelector(colorGeneratorMock);
  const tags = ['foo', 'bar'];
  const tagsList = fromPartial<TagsList>({ tags: [...tags, 'baz'] });
  const setUp = () => renderWithEvents(
    <TagsSelector
      selectedTags={tags}
      tagsList={tagsList}
      settings={fromPartial({})}
      listTags={vi.fn()}
      onChange={onChange}
    />,
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

    expect(container.querySelector('.react-tags__suggestions')).not.toBeInTheDocument();
    expect(screen.queryByText('baz')).not.toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Add tags to the URL'), 'ba');

    expect(container.querySelector('.react-tags__suggestions')).toBeInTheDocument();
    expect(screen.getByText('baz')).toBeInTheDocument();
  });

  it.each([
    ['The-New-Tag', [...tags, 'the-new-tag']],
    ['foo', tags],
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
});
