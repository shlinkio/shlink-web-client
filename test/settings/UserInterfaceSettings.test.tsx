import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Settings, UiSettings } from '../../src/settings/reducers/settings';
import { UserInterfaceSettings } from '../../src/settings/UserInterfaceSettings';
import ToggleSwitch from '../../src/utils/ToggleSwitch';
import { Theme } from '../../src/utils/theme';

describe('<UserInterfaceSettings />', () => {
  let wrapper: ShallowWrapper;
  const setUiSettings = jest.fn();
  const createWrapper = (ui?: UiSettings) => {
    wrapper = shallow(<UserInterfaceSettings settings={Mock.of<Settings>({ ui })} setUiSettings={setUiSettings} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it.each([
    [{ theme: 'dark' as Theme }, true],
    [{ theme: 'light' as Theme }, false],
    [undefined, false],
  ])('toggles switch if theme is dark', (ui, expectedChecked) => {
    const wrapper = createWrapper(ui);
    const toggle = wrapper.find(ToggleSwitch);

    expect(toggle.prop('checked')).toEqual(expectedChecked);
  });

  it.each([
    [{ theme: 'dark' as Theme }, faMoon],
    [{ theme: 'light' as Theme }, faSun],
    [undefined, faSun],
  ])('shows different icons based on theme', (ui, expectedIcon) => {
    const wrapper = createWrapper(ui);
    const icon = wrapper.find(FontAwesomeIcon);

    expect(icon.prop('icon')).toEqual(expectedIcon);
  });

  it.each([
    [true, 'dark'],
    [false, 'light'],
  ])('invokes setUiSettings when theme toggle value changes', (checked, theme) => {
    const wrapper = createWrapper();
    const toggle = wrapper.find(ToggleSwitch);

    expect(setUiSettings).not.toHaveBeenCalled();
    toggle.simulate('change', checked);
    expect(setUiSettings).toHaveBeenCalledWith({ theme });
  });
});
