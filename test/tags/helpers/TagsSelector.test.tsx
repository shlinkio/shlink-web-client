import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import createTagsSelector from '../../../src/tags/helpers/TagsSelector';
import ColorGenerator from '../../../src/utils/services/ColorGenerator';
import { TagsList } from '../../../src/tags/reducers/tagsList';
import { Settings } from '../../../src/settings/reducers/settings';

describe('<TagsSelector />', () => {
  const onChange = jest.fn();
  const TagsSelector = createTagsSelector(Mock.all<ColorGenerator>());
  const tags = ['foo', 'bar'];
  const tagsList = Mock.of<TagsList>({ tags: [...tags, 'baz'] });
  let wrapper: ShallowWrapper;

  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    wrapper = shallow(
      <TagsSelector
        selectedTags={tags}
        tagsList={tagsList}
        settings={Mock.all<Settings>()}
        listTags={jest.fn()}
        onChange={onChange}
      />,
    );
  });

  afterEach(() => wrapper?.unmount());

  it('has expected props', () => {
    expect(wrapper.prop('placeholderText')).toEqual('Add tags to the URL');
    expect(wrapper.prop('allowNew')).toEqual(true);
    expect(wrapper.prop('addOnBlur')).toEqual(true);
    expect(wrapper.prop('minQueryLength')).toEqual(1);
  });

  it('contains expected tags', () => {
    expect(wrapper.prop('tags')).toEqual([
      {
        id: 'foo',
        name: 'foo',
      },
      {
        id: 'bar',
        name: 'bar',
      },
    ]);
  });

  it('contains expected suggestions', () => {
    expect(wrapper.prop('suggestions')).toEqual([
      {
        id: 'baz',
        name: 'baz',
      },
    ]);
  });

  it.each([
    ['The-New-Tag', [...tags, 'the-new-tag']],
    ['comma,separated,tags', [...tags, 'comma', 'separated', 'tags']],
    ['foo', tags],
  ])('invokes onChange when new tags are added', (newTag, expectedTags) => {
    wrapper.simulate('addition', { name: newTag });

    expect(onChange).toHaveBeenCalledWith(expectedTags);
  });

  it.each([
    [0, 'bar'],
    [1, 'foo'],
  ])('invokes onChange when tags are deleted', (index, expected) => {
    wrapper.simulate('delete', index);

    expect(onChange).toHaveBeenCalledWith([expected]);
  });
});
