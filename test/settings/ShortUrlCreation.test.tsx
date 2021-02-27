import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { ShortUrlCreationSettings, Settings } from '../../src/settings/reducers/settings';
import { ShortUrlCreation } from '../../src/settings/ShortUrlCreation';
import ToggleSwitch from '../../src/utils/ToggleSwitch';

describe('<ShortUrlCreation />', () => {
  let wrapper: ShallowWrapper;
  const setShortUrlCreationSettings = jest.fn();
  const createWrapper = (shortUrlCreation?: ShortUrlCreationSettings) => {
    wrapper = shallow(
      <ShortUrlCreation
        settings={Mock.of<Settings>({ shortUrlCreation })}
        setShortUrlCreationSettings={setShortUrlCreationSettings}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it.each([
    [{ validateUrls: true }, true ],
    [{ validateUrls: false }, false ],
    [ undefined, false ],
  ])('switch is toggled if option is true', (shortUrlCreation, expectedChecked) => {
    const wrapper = createWrapper(shortUrlCreation);
    const toggle = wrapper.find(ToggleSwitch);

    expect(toggle.prop('checked')).toEqual(expectedChecked);
  });

  it.each([[ true ], [ false ]])('invokes setShortUrlCreationSettings when toggle value changes', (validateUrls) => {
    const wrapper = createWrapper();
    const toggle = wrapper.find(ToggleSwitch);

    expect(setShortUrlCreationSettings).not.toHaveBeenCalled();
    toggle.simulate('change', validateUrls);
    expect(setShortUrlCreationSettings).toHaveBeenCalledWith({ validateUrls });
  });

  it.each([
    [{ validateUrls: true }, 'checkbox will be checked' ],
    [{ validateUrls: false }, 'checkbox will be unchecked' ],
    [ undefined, 'checkbox will be unchecked' ],
  ])('shows expected helper text', (shortUrlCreation, expectedText) => {
    const wrapper = createWrapper(shortUrlCreation);
    const text = wrapper.find('.form-text');

    expect(text.text()).toContain(expectedText);
  });
});
