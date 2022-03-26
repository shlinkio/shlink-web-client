import { shallow, ShallowWrapper } from 'enzyme';
import { Route, useLocation } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import { Settings } from '../../src/settings/reducers/settings';
import appFactory from '../../src/app/App';
import { AppUpdateBanner } from '../../src/common/AppUpdateBanner';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({}),
}));

describe('<App />', () => {
  let wrapper: ShallowWrapper;
  const MainHeader = () => null;
  const ShlinkVersions = () => null;
  const App = appFactory(
    MainHeader,
    () => null,
    () => null,
    () => null,
    () => null,
    () => null,
    () => null,
    ShlinkVersions,
  );
  const createWrapper = () => {
    wrapper = shallow(
      <App
        fetchServers={() => {}}
        servers={{}}
        settings={Mock.all<Settings>()}
        appUpdated={false}
        resetAppUpdate={() => {}}
      />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders children components', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(MainHeader)).toHaveLength(1);
    expect(wrapper.find(ShlinkVersions)).toHaveLength(1);
    expect(wrapper.find(AppUpdateBanner)).toHaveLength(1);
  });

  it('renders app main routes', () => {
    const wrapper = createWrapper();
    const routes = wrapper.find(Route);
    const expectedPaths = [
      undefined,
      '/settings/*',
      '/manage-servers',
      '/server/create',
      '/server/:serverId/edit',
      '/server/:serverId/*',
    ];

    expect.assertions(expectedPaths.length + 1);
    expect(routes).toHaveLength(expectedPaths.length + 1);
    expectedPaths.forEach((path, index) => {
      expect(routes.at(index).prop('path')).toEqual(path);
    });
  });

  it.each([
    ['/foo', 'shlink-wrapper'],
    ['/bar', 'shlink-wrapper'],
    ['/', 'shlink-wrapper d-flex d-md-block align-items-center'],
  ])('renders expected classes on shlink-wrapper based on current pathname', (pathname, expectedClasses) => {
    (useLocation as any).mockReturnValue({ pathname });

    const wrapper = createWrapper();
    const shlinkWrapper = wrapper.find('.shlink-wrapper');

    expect(shlinkWrapper.prop('className')).toEqual(expectedClasses);
  });
});
