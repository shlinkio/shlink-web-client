import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { ButtonDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV as menuIcon } from '@fortawesome/free-solid-svg-icons';
import { DropdownBtnMenu, DropdownBtnMenuProps } from '../../src/utils/DropdownBtnMenu';

describe('<DropdownBtnMenu />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props: Partial<DropdownBtnMenuProps>) => {
    wrapper = shallow(<DropdownBtnMenu {...Mock.of<DropdownBtnMenuProps>(props)}>the children</DropdownBtnMenu>);

    return wrapper;
  };

  afterAll(() => wrapper?.unmount());

  it('renders expected components', () => {
    const wrapper = createWrapper({});
    const toggle = wrapper.find(DropdownToggle);
    const icon = wrapper.find(FontAwesomeIcon);

    expect(wrapper.find(ButtonDropdown)).toHaveLength(1);
    expect(toggle).toHaveLength(1);
    expect(toggle.prop('size')).toEqual('sm');
    expect(toggle.prop('caret')).toEqual(true);
    expect(toggle.prop('outline')).toEqual(true);
    expect(toggle.prop('className')).toEqual('dropdown-btn-menu__dropdown-toggle');
    expect(icon).toHaveLength(1);
    expect(icon.prop('icon')).toEqual(menuIcon);
  });

  it('renders expected children', () => {
    const menu = createWrapper({}).find(DropdownMenu);

    expect(menu.prop('children')).toEqual('the children');
  });

  it.each([
    [undefined, true],
    [true, true],
    [false, false],
  ])('renders menu to right when expected', (right, expectedRight) => {
    const wrapper = createWrapper({ right });

    expect(wrapper.find(DropdownMenu).prop('end')).toEqual(expectedRight);
  });
});
