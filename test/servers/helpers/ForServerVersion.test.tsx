import { mount, ReactWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import ForServerVersion from '../../../src/servers/helpers/ForServerVersion';
import { ReachableServer, SelectedServer } from '../../../src/servers/data';
import { SemVer, SemVerPattern } from '../../../src/utils/helpers/version';

describe('<ForServerVersion />', () => {
  let wrapped: ReactWrapper;

  const renderComponent = (selectedServer: SelectedServer, minVersion?: SemVerPattern, maxVersion?: SemVerPattern) => {
    wrapped = mount(
      <ForServerVersion minVersion={minVersion} maxVersion={maxVersion} selectedServer={selectedServer}>
        <span>Hello</span>
      </ForServerVersion>,
    );

    return wrapped;
  };

  afterEach(() => wrapped?.unmount());

  it('does not render children when current server is empty', () => {
    const wrapped = renderComponent(null, '1.*.*');

    expect(wrapped.html()).toBeNull();
  });

  it.each([
    ['2.0.0' as SemVerPattern, undefined, '1.8.3' as SemVer],
    [undefined, '1.8.0' as SemVerPattern, '1.8.3' as SemVer],
    ['1.7.0' as SemVerPattern, '1.8.0' as SemVerPattern, '1.8.3' as SemVer],
  ])('does not render children when current version does not match requirements', (min, max, version) => {
    const wrapped = renderComponent(Mock.of<ReachableServer>({ version, printableVersion: version }), min, max);

    expect(wrapped.html()).toBeNull();
  });

  it.each([
    ['2.0.0' as SemVerPattern, undefined, '2.8.3' as SemVer],
    ['2.0.0' as SemVerPattern, undefined, '2.0.0' as SemVer],
    [undefined, '1.8.0' as SemVerPattern, '1.8.0' as SemVer],
    [undefined, '1.8.0' as SemVerPattern, '1.7.1' as SemVer],
    ['1.7.0' as SemVerPattern, '1.8.0' as SemVerPattern, '1.7.3' as SemVer],
  ])('renders children when current version matches requirements', (min, max, version) => {
    const wrapped = renderComponent(Mock.of<ReachableServer>({ version, printableVersion: version }), min, max);

    expect(wrapped.html()).toContain('<span>Hello</span>');
  });
});
