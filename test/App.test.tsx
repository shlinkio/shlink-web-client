import { shallow, ShallowWrapper } from 'enzyme';
import { Route } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import { Alert } from 'reactstrap';
import { Settings } from '../src/settings/reducers/settings';
import appFactory from '../src/App';

describe('<App />', () => {
  let wrapper: ShallowWrapper;
  const MainHeader = () => null;
  const ShlinkVersions = () => null;

  beforeEach(() => {
    const App = appFactory(MainHeader, () => null, () => null, () => null, () => null, () => null, ShlinkVersions);

    wrapper = shallow(
      <App
        fetchServers={() => {}}
        servers={{}}
        settings={Mock.all<Settings>()}
        appUpdated={false}
        resetAppUpdate={() => {}}
      />,
    );
  });
  afterEach(() => wrapper.unmount());

  it('renders a header', () => expect(wrapper.find(MainHeader)).toHaveLength(1));

  it('renders versions', () => expect(wrapper.find(ShlinkVersions)).toHaveLength(1));

  it('renders an Alert', () => expect(wrapper.find(Alert)).toHaveLength(1));

  it('renders app main routes', () => {
    const routes = wrapper.find(Route);
    const expectedPaths = [
      '/',
      '/settings',
      '/server/create',
      '/server/:serverId/edit',
      '/server/:serverId',
    ];

    expect.assertions(expectedPaths.length + 1);
    expect(routes).toHaveLength(expectedPaths.length + 1);
    expectedPaths.forEach((path, index) => {
      expect(routes.at(index).prop('path')).toEqual(path);
    });
  });
});
