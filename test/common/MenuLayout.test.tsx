import { shallow, ShallowWrapper } from 'enzyme';
import { Route, useParams } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import createMenuLayout from '../../src/common/MenuLayout';
import { NonReachableServer, NotFoundServer, ReachableServer, SelectedServer } from '../../src/servers/data';
import { NoMenuLayout } from '../../src/common/NoMenuLayout';
import { SemVer } from '../../src/utils/helpers/version';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({}),
  useLocation: jest.fn().mockReturnValue({}),
}));

describe('<MenuLayout />', () => {
  const ServerError = jest.fn();
  const C = jest.fn();
  const MenuLayout = createMenuLayout(C, C, C, C, C, C, C, C, ServerError, C, C, C);
  let wrapper: ShallowWrapper;
  const createWrapper = (selectedServer: SelectedServer) => {
    (useParams as any).mockReturnValue({ serverId: 'abc123' });

    wrapper = shallow(
      <MenuLayout
        sidebarNotPresent={jest.fn()}
        sidebarPresent={jest.fn()}
        selectServer={jest.fn()}
        selectedServer={selectedServer}
      />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it.each([
    [null, NoMenuLayout],
    [Mock.of<NotFoundServer>({ serverNotFound: true }), ServerError],
  ])('returns error when server is not found', (selectedServer, ExpectedComp) => {
    const wrapper = createWrapper(selectedServer);
    const comp = wrapper.find(ExpectedComp);

    expect(comp).toHaveLength(1);
  });

  it('returns error if server is not reachable', () => {
    const wrapper = createWrapper(Mock.of<NonReachableServer>()).dive();
    const serverError = wrapper.find(ServerError);

    expect(serverError).toHaveLength(1);
  });

  it.each([
    ['2.5.0' as SemVer, 9],
    ['2.6.0' as SemVer, 10],
    ['2.7.0' as SemVer, 10],
    ['2.8.0' as SemVer, 11],
    ['2.10.0' as SemVer, 11],
    ['3.0.0' as SemVer, 12],
  ])('has expected amount of routes based on selected server\'s version', (version, expectedAmountOfRoutes) => {
    const selectedServer = Mock.of<ReachableServer>({ version });
    const wrapper = createWrapper(selectedServer).dive();
    const routes = wrapper.find(Route);

    expect(routes).toHaveLength(expectedAmountOfRoutes);
    expect(routes.findWhere((element) => element.prop('index'))).toHaveLength(1);
  });
});
