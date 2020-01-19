import React from 'react';
import { shallow } from 'enzyme';
import { FormGroup, Modal, ModalHeader } from 'reactstrap';
import each from 'jest-each';
import EditMetaModal from '../../../src/short-urls/helpers/EditMetaModal';

describe('<EditMetaModal />', () => {
  let wrapper;
  const editShortUrlMeta = jest.fn(() => Promise.resolve());
  const resetShortUrlMeta = jest.fn();
  const toggle = jest.fn();
  const createWrapper = (shortUrl, shortUrlMeta) => {
    wrapper = shallow(
      <EditMetaModal
        isOpen={true}
        shortUrl={shortUrl}
        shortUrlMeta={shortUrlMeta}
        toggle={toggle}
        editShortUrlMeta={editShortUrlMeta}
        resetShortUrlMeta={resetShortUrlMeta}
      />
    );

    return wrapper;
  };

  afterEach(() => {
    wrapper && wrapper.unmount();
    jest.clearAllMocks();
  });

  it('properly renders form with components', () => {
    const wrapper = createWrapper({}, { saving: false, error: false, meta: {} });
    const error = wrapper.find('.bg-danger');
    const form = wrapper.find('form');
    const formGroup = form.find(FormGroup);

    expect(form).toHaveLength(1);
    expect(formGroup).toHaveLength(3);
    expect(error).toHaveLength(0);
  });

  each([
    [ true, 'Saving...' ],
    [ false, 'Save' ],
  ]).it('renders submit button on expected state', (saving, expectedText) => {
    const wrapper = createWrapper({}, { saving, error: false, meta: {} });
    const button = wrapper.find('[type="submit"]');

    expect(button.prop('disabled')).toEqual(saving);
    expect(button.text()).toContain(expectedText);
  });

  it('renders error message on error', () => {
    const wrapper = createWrapper({}, { saving: false, error: true, meta: {} });
    const error = wrapper.find('.bg-danger');

    expect(error).toHaveLength(1);
  });

  it('saves meta when form is submit', () => {
    const preventDefault = jest.fn();
    const wrapper = createWrapper({}, { saving: false, error: false, meta: {} });
    const form = wrapper.find('form');

    form.simulate('submit', { preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(editShortUrlMeta).toHaveBeenCalled();
  });

  each([
    [ '.btn-link', 'onClick' ],
    [ Modal, 'toggle' ],
    [ ModalHeader, 'toggle' ],
  ]).it('resets meta when modal is toggled in any way', (componentToFind, propToCall) => {
    const wrapper = createWrapper({}, { saving: false, error: false, meta: {} });
    const component = wrapper.find(componentToFind);

    component.prop(propToCall)();

    expect(resetShortUrlMeta).toHaveBeenCalled();
  });
});
