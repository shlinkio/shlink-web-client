import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import ShlinkVersionsContainer from '../../src/common/ShlinkVersionsContainer';
import { NonReachableServer, NotFoundServer, ReachableServer, SelectedServer } from '../../src/servers/data';

describe('<ShlinkVersionsContainer />', () => {
  let wrapper: ShallowWrapper;

  const createWrapper = (selectedServer: SelectedServer) => {
    wrapper = shallow(<ShlinkVersionsContainer selectedServer={selectedServer} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    [ null, 'text-center' ],
    [ Mock.of<NotFoundServer>({ serverNotFound: true }), 'text-center' ],
    [ Mock.of<NonReachableServer>({ serverNotReachable: true }), 'text-center' ],
    [ Mock.of<ReachableServer>({ version: '1.0.0' }), 'text-center shlink-versions-container--with-server' ],
  ])('renders proper col classes based on type of selected server', (selectedServer, expectedClasses) => {
    const wrapper = createWrapper(selectedServer);

    expect(wrapper.find('div').prop('className')).toEqual(`${expectedClasses}`);
  });
});
