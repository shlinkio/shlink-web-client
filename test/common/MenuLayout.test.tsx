import { shallow, ShallowWrapper } from 'enzyme';
import { History, Location } from 'history';
import { match } from 'react-router'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Route } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import createMenuLayout from '../../src/common/MenuLayout';
import { NonReachableServer, NotFoundServer, ReachableServer, SelectedServer } from '../../src/servers/data';
import NoMenuLayout from '../../src/common/NoMenuLayout';
import { SemVer } from '../../src/utils/helpers/version';

describe('<MenuLayout />', () => {
  const ServerError = jest.fn();
  const C = jest.fn();
  const MenuLayout = createMenuLayout(C, C, C, C, C, C, C, ServerError, C, C, C);
  let wrapper: ShallowWrapper;
  const createWrapper = (selectedServer: SelectedServer) => {
    wrapper = shallow(
      <MenuLayout
        selectServer={jest.fn()}
        selectedServer={selectedServer}
        history={Mock.all<History>()}
        location={Mock.all<Location>()}
        match={Mock.of<match<{ serverId: string }>>({
          params: { serverId: 'abc123' },
        })}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    [ null, NoMenuLayout ],
    [ Mock.of<NotFoundServer>({ serverNotFound: true }), ServerError ],
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
    [ '2.1.0' as SemVer, 7 ],
    [ '2.2.0' as SemVer, 8 ],
    [ '2.5.0' as SemVer, 8 ],
    [ '2.6.0' as SemVer, 9 ],
    [ '2.7.0' as SemVer, 9 ],
  ])('has expected amount of routes based on selected server\'s version', (version, expectedAmountOfRoutes) => {
    const selectedServer = Mock.of<ReachableServer>({ version });
    const wrapper = createWrapper(selectedServer).dive();
    const routes = wrapper.find(Route);

    expect(routes).toHaveLength(expectedAmountOfRoutes);
  });
});
