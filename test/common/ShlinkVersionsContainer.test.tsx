import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import ShlinkVersionsContainer from '../../src/common/ShlinkVersionsContainer';
import { SelectedServer } from '../../src/servers/data';
import { Sidebar } from '../../src/common/reducers/sidebar';

describe('<ShlinkVersionsContainer />', () => {
  let wrapper: ShallowWrapper;

  const createWrapper = (sidebar: Sidebar) => {
    wrapper = shallow(<ShlinkVersionsContainer selectedServer={Mock.all<SelectedServer>()} sidebar={sidebar} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    [{ sidebarPresent: false }, 'text-center'],
    [{ sidebarPresent: true }, 'text-center shlink-versions-container--with-sidebar'],
  ])('renders proper col classes based on sidebar status', (sidebar, expectedClasses) => {
    const wrapper = createWrapper(sidebar);

    expect(wrapper.find('div').prop('className')).toEqual(`${expectedClasses}`);
  });
});
