import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Settings, TagsMode, TagsSettings as TagsSettingsOptions } from '../../src/settings/reducers/settings';
import { TagsModeDropdown } from '../../src/tags/TagsModeDropdown';
import { TagsSettings } from '../../src/settings/TagsSettings';
import { OrderingDropdown } from '../../src/utils/OrderingDropdown';
import { TagsOrder } from '../../src/tags/data/TagsListChildrenProps';
import { LabeledFormGroup } from '../../src/utils/forms/LabeledFormGroup';
import { FormText } from '../../src/utils/forms/FormText';

describe('<TagsSettings />', () => {
  let wrapper: ShallowWrapper;
  const setTagsSettings = jest.fn();
  const createWrapper = (tags?: TagsSettingsOptions) => {
    wrapper = shallow(<TagsSettings settings={Mock.of<Settings>({ tags })} setTagsSettings={setTagsSettings} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it('renders expected amount of groups', () => {
    const wrapper = createWrapper();
    const groups = wrapper.find(LabeledFormGroup);

    expect(groups).toHaveLength(2);
  });

  it.each([
    [undefined, 'cards'],
    [{}, 'cards'],
    [{ defaultMode: 'cards' as TagsMode }, 'cards'],
    [{ defaultMode: 'list' as TagsMode }, 'list'],
  ])('shows expected tags displaying mode', (tags, expectedMode) => {
    const wrapper = createWrapper(tags);
    const dropdown = wrapper.find(TagsModeDropdown);
    const formText = wrapper.find(FormText);

    expect(dropdown.prop('mode')).toEqual(expectedMode);
    expect(formText.html()).toContain(`Tags will be displayed as <b>${expectedMode}</b>.`);
  });

  it.each([
    ['cards' as TagsMode],
    ['list' as TagsMode],
  ])('invokes setTagsSettings when tags mode changes', (defaultMode) => {
    const wrapper = createWrapper();
    const dropdown = wrapper.find(TagsModeDropdown);

    expect(setTagsSettings).not.toHaveBeenCalled();
    dropdown.simulate('change', defaultMode);
    expect(setTagsSettings).toHaveBeenCalledWith({ defaultMode });
  });

  it.each([
    [undefined, {}],
    [{}, {}],
    [{ defaultOrdering: {} }, {}],
    [{ defaultOrdering: { field: 'tag', dir: 'DESC' } as TagsOrder }, { field: 'tag', dir: 'DESC' }],
    [{ defaultOrdering: { field: 'visits', dir: 'ASC' } as TagsOrder }, { field: 'visits', dir: 'ASC' }],
  ])('shows expected ordering', (tags, expectedOrder) => {
    const wrapper = createWrapper(tags);
    const dropdown = wrapper.find(OrderingDropdown);

    expect(dropdown.prop('order')).toEqual(expectedOrder);
  });

  it.each([
    [undefined, undefined],
    ['tag', 'ASC'],
    ['visits', undefined],
    ['shortUrls', 'DESC'],
  ])('invokes setTagsSettings when ordering changes', (field, dir) => {
    const wrapper = createWrapper();
    const dropdown = wrapper.find(OrderingDropdown);

    expect(setTagsSettings).not.toHaveBeenCalled();
    dropdown.simulate('change', field, dir);
    expect(setTagsSettings).toHaveBeenCalledWith({ defaultOrdering: { field, dir } });
  });
});
