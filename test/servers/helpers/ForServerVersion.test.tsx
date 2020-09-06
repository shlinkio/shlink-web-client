import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import ForServerVersion from '../../../src/servers/helpers/ForServerVersion';
import { ReachableServer, SelectedServer } from '../../../src/servers/data';

describe('<ForServerVersion />', () => {
  let wrapped: ReactWrapper;

  const renderComponent = (selectedServer: SelectedServer, minVersion?: string, maxVersion?: string) => {
    wrapped = mount(
      <ForServerVersion minVersion={minVersion} maxVersion={maxVersion} selectedServer={selectedServer}>
        <span>Hello</span>
      </ForServerVersion>,
    );

    return wrapped;
  };

  afterEach(() => wrapped?.unmount());

  it('does not render children when current server is empty', () => {
    const wrapped = renderComponent(null, '1');

    expect(wrapped.html()).toBeNull();
  });

  it.each([
    [ '2.0.0', undefined, '1.8.3' ],
    [ undefined, '1.8.0', '1.8.3' ],
    [ '1.7.0', '1.8.0', '1.8.3' ],
  ])('does not render children when current version does not match requirements', (min, max, version) => {
    const wrapped = renderComponent(Mock.of<ReachableServer>({ version, printableVersion: version }), min, max);

    expect(wrapped.html()).toBeNull();
  });

  it.each([
    [ '2.0.0', undefined, '2.8.3' ],
    [ '2.0.0', undefined, '2.0.0' ],
    [ undefined, '1.8.0', '1.8.0' ],
    [ undefined, '1.8.0', '1.7.1' ],
    [ '1.7.0', '1.8.0', '1.7.3' ],
  ])('renders children when current version matches requirements', (min, max, version) => {
    const wrapped = renderComponent(Mock.of<ReachableServer>({ version, printableVersion: version }), min, max);

    expect(wrapped.html()).toContain('<span>Hello</span>');
  });
});
