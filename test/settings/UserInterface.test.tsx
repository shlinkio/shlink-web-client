import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Settings, UiSettings } from '../../src/settings/reducers/settings';
import { UserInterface } from '../../src/settings/UserInterface';
import ToggleSwitch from '../../src/utils/ToggleSwitch';
import { Theme } from '../../src/utils/theme';

describe('<UserInterface />', () => {
  let wrapper: ShallowWrapper;
  const setUiSettings = jest.fn();
  const createWrapper = (ui?: UiSettings) => {
    wrapper = shallow(
      <UserInterface
        settings={Mock.of<Settings>({ ui })}
        setUiSettings={setUiSettings}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it.each([
    [{ theme: 'dark' as Theme }, true ],
    [{ theme: 'light' as Theme }, false ],
    [ undefined, false ],
  ])('switch is toggled if theme is dark', (ui, expectedChecked) => {
    const wrapper = createWrapper(ui);
    const toggle = wrapper.find(ToggleSwitch);

    expect(toggle.prop('checked')).toEqual(expectedChecked);
  });

  it.each([
    [ true, 'dark' ],
    [ false, 'light' ],
  ])('invokes setUiSettings when toggle value changes', (checked, theme) => {
    const wrapper = createWrapper();
    const toggle = wrapper.find(ToggleSwitch);

    expect(setUiSettings).not.toHaveBeenCalled();
    toggle.simulate('change', checked);
    expect(setUiSettings).toHaveBeenCalledWith({ theme });
  });
});
