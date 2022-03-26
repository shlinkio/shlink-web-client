import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import ShlinkVersions, { ShlinkVersionsProps } from '../../src/common/ShlinkVersions';
import { NonReachableServer, NotFoundServer, ReachableServer } from '../../src/servers/data';

describe('<ShlinkVersions />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props: ShlinkVersionsProps) => {
    wrapper = shallow(<ShlinkVersions {...props} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    ['1.2.3', Mock.of<ReachableServer>({ version: '1.0.0', printableVersion: 'foo' }), 'v1.2.3', 'foo'],
    ['foo', Mock.of<ReachableServer>({ version: '1.0.0', printableVersion: '1.2.3' }), 'latest', '1.2.3'],
    ['latest', Mock.of<ReachableServer>({ version: '1.0.0', printableVersion: 'latest' }), 'latest', 'latest'],
    ['5.5.0', Mock.of<ReachableServer>({ version: '1.0.0', printableVersion: '0.2.8' }), 'v5.5.0', '0.2.8'],
    ['not-semver', Mock.of<ReachableServer>({ version: '1.0.0', printableVersion: 'some' }), 'latest', 'some'],
  ])(
    'displays expected versions when selected server is reachable',
    (clientVersion, selectedServer, expectedClientVersion, expectedServerVersion) => {
      const wrapper = createWrapper({ clientVersion, selectedServer });
      const links = wrapper.find('VersionLink');
      const serverLink = links.at(0);
      const clientLink = links.at(1);

      expect(serverLink.prop('project')).toEqual('shlink');
      expect(serverLink.prop('version')).toEqual(expectedServerVersion);
      expect(clientLink.prop('project')).toEqual('shlink-web-client');
      expect(clientLink.prop('version')).toEqual(expectedClientVersion);
    },
  );

  it.each([
    ['1.2.3', null],
    ['1.2.3', Mock.of<NotFoundServer>({ serverNotFound: true })],
    ['1.2.3', Mock.of<NonReachableServer>({ serverNotReachable: true })],
  ])('displays only client version when selected server is not reachable', (clientVersion, selectedServer) => {
    const wrapper = createWrapper({ clientVersion, selectedServer });
    const links = wrapper.find('VersionLink');

    expect(links).toHaveLength(1);
    expect(links.at(0).prop('project')).toEqual('shlink-web-client');
  });
});
