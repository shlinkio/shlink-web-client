import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { DropdownItem } from 'reactstrap';
import { ServerWithId } from '../../src/servers/data';
import { ManageServersRowDropdown as createManageServersRowDropdown } from '../../src/servers/ManageServersRowDropdown';

describe('<ManageServersRowDropdown />', () => {
  const DeleteServerModal = () => null;
  const ManageServersRowDropdown = createManageServersRowDropdown(DeleteServerModal);
  const setAutoConnect = jest.fn();
  let wrapper: ShallowWrapper;
  const createWrapper = (autoConnect = false) => {
    const server = Mock.of<ServerWithId>({ id: 'abc123', autoConnect });

    wrapper = shallow(<ManageServersRowDropdown setAutoConnect={setAutoConnect} server={server} />);

    return wrapper;
  };

  afterEach(jest.clearAllMocks);

  it('renders expected amount of dropdown items', () => {
    const wrapper = createWrapper();
    const items = wrapper.find(DropdownItem);

    expect(items).toHaveLength(5);
    expect(items.find('[divider]')).toHaveLength(1);
    expect(items.at(0).prop('to')).toEqual('/server/abc123');
    expect(items.at(1).prop('to')).toEqual('/server/abc123/edit');
  });

  it('allows toggling auto-connect', () => {
    const wrapper = createWrapper();

    expect(setAutoConnect).not.toHaveBeenCalled();
    wrapper.find(DropdownItem).at(2).simulate('click');
    expect(setAutoConnect).toHaveBeenCalledWith(expect.objectContaining({ id: 'abc123' }), true);
  });

  it('renders a modal', () => {
    const wrapper = createWrapper();
    const modal = wrapper.find(DeleteServerModal);

    expect(modal).toHaveLength(1);
    expect(modal.prop('redirectHome')).toEqual(false);
    expect(modal.prop('server')).toEqual(expect.objectContaining({ id: 'abc123' }));
    expect(modal.prop('isOpen')).toEqual(false);
  });

  it('allows toggling the modal', () => {
    const wrapper = createWrapper();
    const modalToggle = wrapper.find(DropdownItem).last();

    expect(wrapper.find(DeleteServerModal).prop('isOpen')).toEqual(false);

    modalToggle.simulate('click');
    expect(wrapper.find(DeleteServerModal).prop('isOpen')).toEqual(true);

    (wrapper.find(DeleteServerModal).prop('toggle') as Function)();
    expect(wrapper.find(DeleteServerModal).prop('isOpen')).toEqual(false);
  });

  it('can be toggled', () => {
    const wrapper = createWrapper();

    expect(wrapper.prop('isOpen')).toEqual(false);

    (wrapper.prop('toggle') as Function)();
    expect(wrapper.prop('isOpen')).toEqual(true);

    (wrapper.prop('toggle') as Function)();
    expect(wrapper.prop('isOpen')).toEqual(false);
  });

  it.each([
    [true, 'Do not auto-connect'],
    [false, 'Auto-connect'],
  ])('shows different auto-connect toggle text depending on current server status', (autoConnect, expectedText) => {
    const wrapper = createWrapper(autoConnect);
    const item = wrapper.find(DropdownItem).at(2);

    expect(item.html()).toContain(expectedText);
  });
});
