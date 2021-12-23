import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Settings, TagsMode, TagsSettings } from '../../src/settings/reducers/settings';
import { TagsModeDropdown } from '../../src/tags/TagsModeDropdown';
import { Tags } from '../../src/settings/Tags';

describe('<Tags />', () => {
  let wrapper: ShallowWrapper;
  const setTagsSettings = jest.fn();
  const createWrapper = (tags?: TagsSettings) => {
    wrapper = shallow(<Tags settings={Mock.of<Settings>({ tags })} setTagsSettings={setTagsSettings} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it.each([
    [ undefined, 'cards' ],
    [{}, 'cards' ],
    [{ defaultMode: 'cards' as TagsMode }, 'cards' ],
    [{ defaultMode: 'list' as TagsMode }, 'list' ],
  ])('shows expected tags displaying mode', (tags, expectedMode) => {
    const wrapper = createWrapper(tags);
    const dropdown = wrapper.find(TagsModeDropdown);
    const small = wrapper.find('small');

    expect(dropdown.prop('mode')).toEqual(expectedMode);
    expect(small.html()).toContain(`Tags will be displayed as <b>${expectedMode}</b>.`);
  });

  it.each([
    [ 'cards' as TagsMode ],
    [ 'list' as TagsMode ],
  ])('invokes setTagsSettings when tags mode changes', (defaultMode) => {
    const wrapper = createWrapper();
    const dropdown = wrapper.find(TagsModeDropdown);

    expect(setTagsSettings).not.toHaveBeenCalled();
    dropdown.simulate('change', defaultMode);
    expect(setTagsSettings).toHaveBeenCalledWith({ defaultMode });
  });
});
