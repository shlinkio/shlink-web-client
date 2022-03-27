import { shallow, ShallowWrapper } from 'enzyme';
import { useLocation } from 'react-router-dom';
import { Collapse, NavbarToggler, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import createMainHeader from '../../src/common/MainHeader';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({}),
}));

describe('<MainHeader />', () => {
  const ServersDropdown = () => null;
  const MainHeader = createMainHeader(ServersDropdown);
  let wrapper: ShallowWrapper;

  const createWrapper = (pathname = '') => {
    (useLocation as any).mockReturnValue({ pathname });

    wrapper = shallow(<MainHeader />);

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders ServersDropdown', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(ServersDropdown)).toHaveLength(1);
  });

  it.each([
    ['/foo', false],
    ['/bar', false],
    ['/settings', true],
    ['/settings/foo', true],
    ['/settings/bar', true],
  ])('sets link to settings as active only when current path is settings', (currentPath, isActive) => {
    const wrapper = createWrapper(currentPath);
    const settingsLink = wrapper.find(NavLink);

    expect(settingsLink.prop('active')).toEqual(isActive);
  });

  it('renders expected class based on the nav bar state', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(NavbarToggler).find(FontAwesomeIcon).prop('className')).toEqual('main-header__toggle-icon');
    wrapper.find(NavbarToggler).simulate('click');
    expect(wrapper.find(NavbarToggler).find(FontAwesomeIcon).prop('className')).toEqual(
      'main-header__toggle-icon main-header__toggle-icon--opened',
    );
    wrapper.find(NavbarToggler).simulate('click');
    expect(wrapper.find(NavbarToggler).find(FontAwesomeIcon).prop('className')).toEqual('main-header__toggle-icon');
  });

  it('opens Collapse when clicking toggle', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(Collapse).prop('isOpen')).toEqual(false);
    wrapper.find(NavbarToggler).simulate('click');
    expect(wrapper.find(Collapse).prop('isOpen')).toEqual(true);
    wrapper.find(NavbarToggler).simulate('click');
    expect(wrapper.find(Collapse).prop('isOpen')).toEqual(false);
  });
});
