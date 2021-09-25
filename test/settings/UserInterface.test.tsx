import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Settings, TagsMode, UiSettings } from '../../src/settings/reducers/settings';
import { UserInterface } from '../../src/settings/UserInterface';
import ToggleSwitch from '../../src/utils/ToggleSwitch';
import { Theme } from '../../src/utils/theme';
import { TagsModeDropdown } from '../../src/tags/TagsModeDropdown';

describe('<UserInterface />', () => {
  let wrapper: ShallowWrapper;
  const setUiSettings = jest.fn();
  const createWrapper = (ui?: UiSettings) => {
    wrapper = shallow(<UserInterface settings={Mock.of<Settings>({ ui })} setUiSettings={setUiSettings} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it.each([
    [{ theme: 'dark' as Theme }, true ],
    [{ theme: 'light' as Theme }, false ],
    [ undefined, false ],
  ])('toggles switch if theme is dark', (ui, expectedChecked) => {
    const wrapper = createWrapper(ui);
    const toggle = wrapper.find(ToggleSwitch);

    expect(toggle.prop('checked')).toEqual(expectedChecked);
  });

  it.each([
    [{ theme: 'dark' as Theme }, faMoon ],
    [{ theme: 'light' as Theme }, faSun ],
    [ undefined, faSun ],
  ])('shows different icons based on theme', (ui, expectedIcon) => {
    const wrapper = createWrapper(ui);
    const icon = wrapper.find(FontAwesomeIcon);

    expect(icon.prop('icon')).toEqual(expectedIcon);
  });

  it.each([
    [ true, 'dark' ],
    [ false, 'light' ],
  ])('invokes setUiSettings when theme toggle value changes', (checked, theme) => {
    const wrapper = createWrapper();
    const toggle = wrapper.find(ToggleSwitch);

    expect(setUiSettings).not.toHaveBeenCalled();
    toggle.simulate('change', checked);
    expect(setUiSettings).toHaveBeenCalledWith({ theme });
  });

  it.each([
    [ undefined, 'cards' ],
    [{ theme: 'light' as Theme }, 'cards' ],
    [{ theme: 'light' as Theme, tagsMode: 'cards' as TagsMode }, 'cards' ],
    [{ theme: 'light' as Theme, tagsMode: 'list' as TagsMode }, 'list' ],
  ])('shows expected tags displaying mode', (ui, expectedMode) => {
    const wrapper = createWrapper(ui);
    const dropdown = wrapper.find(TagsModeDropdown);
    const small = wrapper.find('small');

    expect(dropdown.prop('mode')).toEqual(expectedMode);
    expect(small.html()).toContain(`Tags will be displayed as <b>${expectedMode}</b>.`);
  });

  it.each([
    [ 'cards' as TagsMode ],
    [ 'list' as TagsMode ],
  ])('invokes setUiSettings when tags mode changes', (tagsMode) => {
    const wrapper = createWrapper();
    const dropdown = wrapper.find(TagsModeDropdown);

    expect(setUiSettings).not.toHaveBeenCalled();
    dropdown.simulate('change', tagsMode);
    expect(setUiSettings).toHaveBeenCalledWith({ theme: 'light', tagsMode });
  });
});
