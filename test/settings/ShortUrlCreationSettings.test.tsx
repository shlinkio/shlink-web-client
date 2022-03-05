import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { DropdownItem } from 'reactstrap';
import { ShortUrlCreationSettings as ShortUrlsSettings, Settings } from '../../src/settings/reducers/settings';
import { ShortUrlCreationSettings } from '../../src/settings/ShortUrlCreationSettings';
import { FormText } from '../../src/utils/FormText';
import ToggleSwitch from '../../src/utils/ToggleSwitch';
import { DropdownBtn } from '../../src/utils/DropdownBtn';

describe('<ShortUrlCreationSettings />', () => {
  let wrapper: ShallowWrapper;
  const setShortUrlCreationSettings = jest.fn();
  const createWrapper = (shortUrlCreation?: ShortUrlsSettings) => {
    wrapper = shallow(
      <ShortUrlCreationSettings
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
    const urlValidationToggle = wrapper.find(ToggleSwitch).first();

    expect(urlValidationToggle.prop('checked')).toEqual(expectedChecked);
  });

  it.each([
    [{ forwardQuery: true }, true ],
    [{ forwardQuery: false }, false ],
    [{}, true ],
  ])('forward query switch is toggled if option is true', (shortUrlCreation, expectedChecked) => {
    const wrapper = createWrapper({ validateUrls: true, ...shortUrlCreation });
    const forwardQueryToggle = wrapper.find(ToggleSwitch).last();

    expect(forwardQueryToggle.prop('checked')).toEqual(expectedChecked);
  });

  it.each([
    [{ validateUrls: true }, 'Validate URL checkbox will be checked' ],
    [{ validateUrls: false }, 'Validate URL checkbox will be unchecked' ],
    [ undefined, 'Validate URL checkbox will be unchecked' ],
  ])('shows expected helper text for URL validation', (shortUrlCreation, expectedText) => {
    const wrapper = createWrapper(shortUrlCreation);
    const validateUrlText = wrapper.find(FormText).first();

    expect(validateUrlText.text()).toContain(expectedText);
  });

  it.each([
    [{ forwardQuery: true }, 'Forward query params on redirect checkbox will be checked' ],
    [{ forwardQuery: false }, 'Forward query params on redirect checkbox will be unchecked' ],
    [{}, 'Forward query params on redirect checkbox will be checked' ],
  ])('shows expected helper text for query forwarding', (shortUrlCreation, expectedText) => {
    const wrapper = createWrapper({ validateUrls: true, ...shortUrlCreation });
    const forwardQueryText = wrapper.find(FormText).at(1);

    expect(forwardQueryText.text()).toContain(expectedText);
  });

  it.each([
    [ { tagFilteringMode: 'includes' } as ShortUrlsSettings, 'Suggest tags including input', 'including' ],
    [
      { tagFilteringMode: 'startsWith' } as ShortUrlsSettings,
      'Suggest tags starting with input',
      'starting with',
    ],
    [ undefined, 'Suggest tags starting with input', 'starting with' ],
  ])('shows expected texts for tags suggestions', (shortUrlCreation, expectedText, expectedHint) => {
    const wrapper = createWrapper(shortUrlCreation);
    const hintText = wrapper.find(FormText).last();
    const dropdown = wrapper.find(DropdownBtn);

    expect(dropdown.prop('text')).toEqual(expectedText);
    expect(hintText.text()).toContain(expectedHint);
  });

  it.each([[ true ], [ false ]])('invokes setShortUrlCreationSettings when URL validation toggle value changes', (validateUrls) => {
    const wrapper = createWrapper();
    const urlValidationToggle = wrapper.find(ToggleSwitch).first();

    expect(setShortUrlCreationSettings).not.toHaveBeenCalled();
    urlValidationToggle.simulate('change', validateUrls);
    expect(setShortUrlCreationSettings).toHaveBeenCalledWith({ validateUrls });
  });

  it.each([[ true ], [ false ]])('invokes setShortUrlCreationSettings when forward query toggle value changes', (forwardQuery) => {
    const wrapper = createWrapper();
    const urlValidationToggle = wrapper.find(ToggleSwitch).last();

    expect(setShortUrlCreationSettings).not.toHaveBeenCalled();
    urlValidationToggle.simulate('change', forwardQuery);
    expect(setShortUrlCreationSettings).toHaveBeenCalledWith(expect.objectContaining({ forwardQuery }));
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
