import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { DropdownItem } from 'reactstrap';
import { ShortUrlCreationSettings, Settings } from '../../src/settings/reducers/settings';
import { ShortUrlCreation } from '../../src/settings/ShortUrlCreation';
import ToggleSwitch from '../../src/utils/ToggleSwitch';
import { DropdownBtn } from '../../src/utils/DropdownBtn';

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
  ])('URL validation switch is toggled if option is true', (shortUrlCreation, expectedChecked) => {
    const wrapper = createWrapper(shortUrlCreation);
    const toggle = wrapper.find(ToggleSwitch);

    expect(toggle.prop('checked')).toEqual(expectedChecked);
  });

  it.each([
    [{ validateUrls: true }, 'checkbox will be checked' ],
    [{ validateUrls: false }, 'checkbox will be unchecked' ],
    [ undefined, 'checkbox will be unchecked' ],
  ])('shows expected helper text for URL validation', (shortUrlCreation, expectedText) => {
    const wrapper = createWrapper(shortUrlCreation);
    const text = wrapper.find('.form-text').first();

    expect(text.text()).toContain(expectedText);
  });

  it.each([
    [ { tagFilteringMode: 'includes' } as ShortUrlCreationSettings, 'Suggest tags including input', 'including' ],
    [
      { tagFilteringMode: 'startsWith' } as ShortUrlCreationSettings,
      'Suggest tags starting with input',
      'starting with',
    ],
    [ undefined, 'Suggest tags starting with input', 'starting with' ],
  ])('shows expected texts for tags suggestions', (shortUrlCreation, expectedText, expectedHint) => {
    const wrapper = createWrapper(shortUrlCreation);
    const hintText = wrapper.find('.form-text').last();
    const dropdown = wrapper.find(DropdownBtn);

    expect(dropdown.prop('text')).toEqual(expectedText);
    expect(hintText.text()).toContain(expectedHint);
  });

  it.each([[ true ], [ false ]])('invokes setShortUrlCreationSettings when toggle value changes', (validateUrls) => {
    const wrapper = createWrapper();
    const toggle = wrapper.find(ToggleSwitch);

    expect(setShortUrlCreationSettings).not.toHaveBeenCalled();
    toggle.simulate('change', validateUrls);
    expect(setShortUrlCreationSettings).toHaveBeenCalledWith({ validateUrls });
  });

  it('invokes setShortUrlCreationSettings when dropdown value changes', () => {
    const wrapper = createWrapper();
    const firstDropdownItem = wrapper.find(DropdownItem).first();
    const secondDropdownItem = wrapper.find(DropdownItem).last();

    expect(setShortUrlCreationSettings).not.toHaveBeenCalled();

    firstDropdownItem.simulate('click');
    expect(setShortUrlCreationSettings).toHaveBeenCalledWith(expect.objectContaining(
      { tagFilteringMode: 'startsWith' },
    ));

    secondDropdownItem.simulate('click');
    expect(setShortUrlCreationSettings).toHaveBeenCalledWith(expect.objectContaining(
      { tagFilteringMode: 'includes' },
    ));
  });
});
