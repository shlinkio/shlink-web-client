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

  test.each([
    [ null, 'col-12' ],
    [ Mock.of<NotFoundServer>({ serverNotFound: true }), 'col-12' ],
    [ Mock.of<NonReachableServer>({ serverNotReachable: true }), 'col-12' ],
    [ Mock.of<ReachableServer>({ printableVersion: 'v1.0.0' }), 'col-lg-10 offset-lg-2 col-md-9 offset-md-3' ],
  ])('renders proper col classes based on type of selected server', (selectedServer, expectedClasses) => {
    const wrapper = createWrapper(selectedServer);

    expect(wrapper.find('div').at(1).prop('className')).toEqual(`text-center ${expectedClasses}`);
  });
});
