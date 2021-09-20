import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Button, Input, Modal, ModalHeader, Popover } from 'reactstrap';
import { TagEdition } from '../../../src/tags/reducers/tagEdit';
import createEditTagModal from '../../../src/tags/helpers/EditTagModal';
import ColorGenerator from '../../../src/utils/services/ColorGenerator';
import { Result } from '../../../src/utils/Result';
import { ProblemDetailsError } from '../../../src/api/types';
import { ShlinkApiError } from '../../../src/api/ShlinkApiError';
import { ChromePicker } from 'react-color';

describe('<EditTagModal />', () => {
  const EditTagModal = createEditTagModal(Mock.of<ColorGenerator>({ getColorForKey: jest.fn(() => 'red') }));
  const editTag = jest.fn().mockReturnValue(Promise.resolve());
  const tagEdited = jest.fn().mockReturnValue(Promise.resolve());
  const toggle = jest.fn();
  let wrapper: ShallowWrapper;
  const createWrapper = (tagEdit: Partial<TagEdition> = {}) => {
    const edition = Mock.of<TagEdition>(tagEdit);

    wrapper = shallow(
      <EditTagModal isOpen tag="foo" tagEdit={edition} editTag={editTag} tagEdited={tagEdited} toggle={toggle} />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  test('modal can be toggled with different mechanisms', () => {
    const wrapper = createWrapper();
    const modal = wrapper.find(Modal);
    const modalHeader = wrapper.find(ModalHeader);
    const cancelBtn = wrapper.find(Button).findWhere((btn) => btn.prop('type') === 'button');

    expect(toggle).not.toHaveBeenCalled();

    (modal.prop('toggle') as Function)();
    (modalHeader.prop('toggle') as Function)();
    cancelBtn.simulate('click');

    expect(toggle).toHaveBeenCalledTimes(3);
    expect(editTag).not.toHaveBeenCalled();
    expect(tagEdited).not.toHaveBeenCalled();
  });

  test.each([
    [ true, 'Saving...' ],
    [ false, 'Save' ],
  ])('submit button is rendered in expected state', (editing, expectedText) => {
    const wrapper = createWrapper({ editing });
    const submitBtn = wrapper.find(Button).findWhere((btn) => btn.prop('color') === 'primary');

    expect(submitBtn.html()).toContain(expectedText);
    expect(submitBtn.prop('disabled')).toEqual(editing);
  });

  test.each([
    [ true, 1 ],
    [ false, 0 ],
  ])('error result is displayed in case of error', (error, expectedResultCount) => {
    const wrapper = createWrapper({ error, errorData: Mock.all<ProblemDetailsError>() });
    const result = wrapper.find(Result);
    const apiError = wrapper.find(ShlinkApiError);

    expect(result).toHaveLength(expectedResultCount);
    expect(apiError).toHaveLength(expectedResultCount);
  });

  test('tag value is updated when text changes', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(Input).prop('value')).toEqual('foo');
    wrapper.find(Input).simulate('change', { target: { value: 'bar' } });
    expect(wrapper.find(Input).prop('value')).toEqual('bar');
  });

  test('all functions are invoked on form submit', async () => {
    const wrapper = createWrapper();
    const form = wrapper.find('form');

    expect(editTag).not.toHaveBeenCalled();
    expect(tagEdited).not.toHaveBeenCalled();

    await form.simulate('submit', { preventDefault: jest.fn() }); // eslint-disable-line @typescript-eslint/await-thenable

    expect(editTag).toHaveBeenCalled();
    expect(tagEdited).toHaveBeenCalled();
  });

  test('color is changed when changing on color picker', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(ChromePicker).prop('color')).toEqual('red');
    wrapper.find(ChromePicker).simulate('change', { hex: 'blue' });
    expect(wrapper.find(ChromePicker).prop('color')).toEqual('blue');
  });

  test('popover can be toggled with different mechanisms', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(Popover).prop('isOpen')).toEqual(false);
    (wrapper.find(Popover).prop('toggle') as Function)();
    expect(wrapper.find(Popover).prop('isOpen')).toEqual(true);
    wrapper.find('.input-group-prepend').simulate('click');
    expect(wrapper.find(Popover).prop('isOpen')).toEqual(false);
  });
});
