import React from 'react';
import { shallow } from 'enzyme';
import { FormGroup, Modal, ModalHeader } from 'reactstrap';
import EditShortUrlModal from '../../../src/short-urls/helpers/EditShortUrlModal';

describe('<EditShortUrlModal />', () => {
  let wrapper;
  const editShortUrl = jest.fn(() => Promise.resolve());
  const toggle = jest.fn();
  const createWrapper = (shortUrl, shortUrlEdition) => {
    wrapper = shallow(
      <EditShortUrlModal
        isOpen={true}
        shortUrl={shortUrl}
        shortUrlEdition={shortUrlEdition}
        toggle={toggle}
        editShortUrl={editShortUrl}
      />,
    );

    return wrapper;
  };

  afterEach(() => {
    wrapper && wrapper.unmount();
    jest.clearAllMocks();
  });

  it.each([
    [ false, 0 ],
    [ true, 1 ],
  ])('properly renders form with expected components', (error, expectedErrorLength) => {
    const wrapper = createWrapper({}, { saving: false, error });
    const errorElement = wrapper.find('.bg-danger');
    const form = wrapper.find('form');
    const formGroup = form.find(FormGroup);

    expect(form).toHaveLength(1);
    expect(formGroup).toHaveLength(1);
    expect(errorElement).toHaveLength(expectedErrorLength);
  });

  it.each([
    [ true, 'Saving...', 'something', true ],
    [ true, 'Saving...', undefined, true ],
    [ false, 'Save', 'something', false ],
    [ false, 'Save', undefined, true ],
  ])('renders submit button on expected state', (saving, expectedText, longUrl, expectedDisabled) => {
    const wrapper = createWrapper({ longUrl }, { saving, error: false });
    const button = wrapper.find('[color="primary"]');

    expect(button.prop('disabled')).toEqual(expectedDisabled);
    expect(button.html()).toContain(expectedText);
  });

  it('saves data when form is submit', () => {
    const preventDefault = jest.fn();
    const wrapper = createWrapper({}, { saving: false, error: false });
    const form = wrapper.find('form');

    form.simulate('submit', { preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(editShortUrl).toHaveBeenCalled();
  });

  it.each([
    [ '[color="link"]', 'onClick' ],
    [ Modal, 'toggle' ],
    [ ModalHeader, 'toggle' ],
  ])('toggles modal with different mechanisms', (componentToFind, propToCall) => {
    const wrapper = createWrapper({}, { saving: false, error: false });
    const component = wrapper.find(componentToFind);

    component.prop(propToCall)();

    expect(toggle).toHaveBeenCalled();
  });
});
