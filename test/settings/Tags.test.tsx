import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { FormGroup } from 'reactstrap';
import { Settings, TagsMode, TagsSettings } from '../../src/settings/reducers/settings';
import { TagsModeDropdown } from '../../src/tags/TagsModeDropdown';
import { Tags } from '../../src/settings/Tags';
import { SortingDropdown } from '../../src/utils/SortingDropdown';
import { TagsOrder } from '../../src/tags/data/TagsListChildrenProps';

describe('<Tags />', () => {
  let wrapper: ShallowWrapper;
  const setTagsSettings = jest.fn();
  const createWrapper = (tags?: TagsSettings) => {
    wrapper = shallow(<Tags settings={Mock.of<Settings>({ tags })} setTagsSettings={setTagsSettings} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it('renders expected amount of groups', () => {
    const wrapper = createWrapper();
    const groups = wrapper.find(FormGroup);

    expect(groups).toHaveLength(2);
  });

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

  it.each([
    [ undefined, {}],
    [{}, {}],
    [{ defaultOrdering: {} }, {}],
    [{ defaultOrdering: { field: 'tag', dir: 'DESC' } as TagsOrder }, { field: 'tag', dir: 'DESC' }],
    [{ defaultOrdering: { field: 'visits', dir: 'ASC' } as TagsOrder }, { field: 'visits', dir: 'ASC' }],
  ])('shows expected ordering', (tags, expectedOrder) => {
    const wrapper = createWrapper(tags);
    const dropdown = wrapper.find(SortingDropdown);

    expect(dropdown.prop('order')).toEqual(expectedOrder);
  });

  it.each([
    [ undefined, undefined ],
    [ 'tag', 'ASC' ],
    [ 'visits', undefined ],
    [ 'shortUrls', 'DESC' ],
  ])('invokes setTagsSettings when ordering changes', (field, dir) => {
    const wrapper = createWrapper();
    const dropdown = wrapper.find(SortingDropdown);

    expect(setTagsSettings).not.toHaveBeenCalled();
    dropdown.simulate('change', field, dir);
    expect(setTagsSettings).toHaveBeenCalledWith({ defaultOrdering: { field, dir } });
  });
});
